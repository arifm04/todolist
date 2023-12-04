import React, { useEffect, useState, useMemo } from 'react';
import {
  Container, AppBar, Toolbar, Typography, Box, TextField, Button, IconButton, Avatar,
  MenuItem, Grid, Card, CardContent, CardActions, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, fetchTodos, updateTaskStatus, updateTask, deleteTask, authCheck } from '../../features/todoListSlice';
import { logout } from "../../features/userSlice"
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import AlertComponent from '../Alert';
import SummarizeIcon from '@mui/icons-material/Summarize';

function TodoListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todoList.data) || [];

  const safeTodos = useMemo(() => Array.isArray(todos) ? todos : [], [todos]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    status: 'pending',
    category: ''
  });
  const [alert, setAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [sortKey, setSortKey] = useState('dueDate');
  const [filter, setFilter] = useState({
    date: null,
    category: '',
    status: ''
  });
  const [editTask, setEditTask] = useState({
    id: null,
    title: '',
    description: '',
    dueDate: new Date(),
    status: '',
    category: ''
  });
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    dispatch(fetchTodos({ uid: uid }));
  }, [dispatch]);

  const handleSortChange = (event) => {
    setSortKey(event.target.value);
  };
  const handleEditClick = (task) => {
    setEditTask({
      id: task._id,
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate),
      status: task.status,
      category: task.category
    });
  };
  const handleDeleteTask = async (taskId) => {

    await dispatch(deleteTask({ taskId, uid }));
    dispatch(fetchTodos({ uid: uid }));
  };
  const handleEditChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  const handleEditDateChange = (date) => {
    setEditTask({ ...editTask, dueDate: date });
  };
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("uid");
    localStorage.removeItem("utno");
    navigate('/');
  };
  const handleEditTask = async () => {
    if (editTask.title !== '' && editTask.category !== '') {
      await dispatch(updateTask(editTask, uid));
      dispatch(fetchTodos({ uid: uid }));
      setEditTask({ id: null, title: '', description: '', dueDate: new Date(), status: '', category: '' });
      setAlert({ message: "Task Updated Successfully", severity: "success" })
      setTimeout(() => {
        setAlert(null)
      }, 3000)
    } else {
      setAlert({ message: "Please fill all the fields!", severity: "error" })
      setTimeout(() => {
        setAlert(null)
      }, 3000)
    }
  };

  const handleFilterChange = (name, value) => {
    setFilter({ ...filter, [name]: value });
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setNewTask({ ...newTask, dueDate: date });
  };
  const handleClearFiltersAndSort = () => {
    setSortKey('dueDate'); 
    setFilter({
      date: null,
      category: '',
      status: ''
    });
    dispatch(fetchTodos({ uid: uid }));
  };

  const handleAddTask = async () => {
    if (newTask.title !== '' && newTask.category !== '') {
      await dispatch(addTask({ newTask, uid }));
      dispatch(fetchTodos({ uid: uid }));
      setNewTask({ title: '', description: '', dueDate: new Date(), status: 'pending', category: '' });
      setAlert({ message: "Task added Successfully", severity: "success" })
      setTimeout(() => {
        setAlert(null)
      }, 3000)
    } else {
      setAlert({ message: "Please fill all the fields!", severity: "error" })
      setTimeout(() => {
        setAlert(null)
      }, 3000)
    }

  };

  const handleStatusChange = async (taskId, newStatus) => {
    if (newStatus !== null) {
      await dispatch(updateTaskStatus({ id: taskId, status: newStatus, uid: uid }));
      dispatch(fetchTodos({ uid: uid }));
    }
  };

  const filteredAndSortedTasks = safeTodos
  .filter(task => {
    return (filter.date ? new Date(task.dueDate).toDateString() === new Date(filter.date).toDateString() : true) &&
      (filter.category ? task.category === filter.category : true) &&
      (filter.status ? task.status === filter.status : true);
  })
  .sort((a, b) => {
    if (sortKey === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortKey === 'status') {
      const statusA = a.status || "";
      const statusB = b.status || "";
      return statusA.localeCompare(statusB);
    }
    return 0;
  });


  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredAndSortedTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  return (

    <Container>
      {alert &&
        <AlertComponent message={alert.message} severity={alert.severity} />
      }
      <AppBar position="static" sx={{ backgroundColor: "#C30404" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo List
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, paddingTop: 5 }}>
        <TextField
          select
          value={sortKey}
          label="Sort By"
          onChange={handleSortChange}
          sx={{
            '& label.Mui-focused': {
              color: 'green',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: 'green',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'red',
              },
              '&:hover fieldset': {
                borderColor: 'yellow',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'green',
              },
              'input': {
                color: 'blue',
              }
            },
          }}
        >
          <MenuItem value="dueDate">Due Date</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </TextField>

        <TextField
          select
          label="Filter by Category"
          value={filter.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          sx={{
            width: '15%',
            '& label.Mui-focused': {
              color: 'green',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: 'green',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'red',
              },
              '&:hover fieldset': {
                borderColor: 'yellow',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'green',
              },
              'input': {
                color: 'blue',
              }
            },
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="personal">Personal</MenuItem>
          <MenuItem value="work">Work</MenuItem>
          <MenuItem value="shopping">Shopping</MenuItem>
        </TextField>
        <Button
          onClick={handleClearFiltersAndSort}
          variant="outlined"
          color="secondary"
          sx={{ alignSelf: 'center', padding: 1.5 }} 
        >
          Clear Filters and Sort
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          label="Title"
          name="title"
          value={newTask.title}
          required
          onChange={handleChange}
          sx={{
            '& label.Mui-focused': {
              color: 'green',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: 'green',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'red',
              },
              '&:hover fieldset': {
                borderColor: 'yellow',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'green',
              },
              'input': {
                color: 'blue',
              }
            },
          }}
        />

        <TextField
          label="Description"
          name="description"
          value={newTask.description}
          onChange={handleChange}
          sx={{
            '& label.Mui-focused': {
              color: 'green',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: 'green',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'red',
              },
              '&:hover fieldset': {
                borderColor: 'yellow',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'green',
              },
              'input': {
                color: 'blue',
              }
            },
          }}
        />

        <TextField
          select
          label="Category"
          name="category"
          value={newTask.category}
          onChange={handleChange}
          sx={{
            width: "15%",
            '& label.Mui-focused': {
              color: 'green',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: 'green',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'red',
              },
              '&:hover fieldset': {
                borderColor: 'yellow',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'green',
              },
              'input': {
                color: 'blue',
              }
            },
          }}
        >
          <MenuItem value="personal">Personal</MenuItem>
          <MenuItem value="work">Work</MenuItem>
          <MenuItem value="shopping">Shopping</MenuItem>
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Due Date"
            value={newTask.dueDate}
            onChange={handleDateChange}
            minDate={new Date()}
            component={{
              OpenPickerIcon: TextField

            }}
            sx={{
              '& label.Mui-focused': {
                color: 'green',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: 'green',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'red',
                },
                '&:hover fieldset': {
                  borderColor: 'yellow',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'green',
                },
                'input': {
                  color: 'blue',
                }
              },
            }}
          />

        </LocalizationProvider>

        <Button onClick={handleAddTask} variant="outlined" color="primary">
          Add Task
        </Button>
      </Box>
      {editTask.id && (
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={editTask.title}
            required
            onChange={handleEditChange}
            sx={{
              '& label.Mui-focused': {
                color: 'green',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: 'green',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'red',
                },
                '&:hover fieldset': {
                  borderColor: 'yellow',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'green',
                },
                'input': {
                  color: 'blue',
                }
              },
            }}

          />
          <TextField
            label="Description"
            name="description"
            value={editTask.description}
            onChange={handleEditChange}
            sx={{
              '& label.Mui-focused': {
                color: 'green',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: 'green',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'red',
                },
                '&:hover fieldset': {
                  borderColor: 'yellow',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'green',
                },
                'input': {
                  color: 'blue',
                }
              },
            }}
          />
          <TextField
            select
            label="Category"
            name="category"
            value={editTask.category}
            onChange={handleEditChange}
            sx={{
              width: "15%",
              '& label.Mui-focused': {
                color: 'green',
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: 'green',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'red',
                },
                '&:hover fieldset': {
                  borderColor: 'yellow',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'green',
                },
                'input': {
                  color: 'blue',
                }
              },
            }}
          >
            <MenuItem value="personal">Personal</MenuItem>
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="shopping">Shopping</MenuItem>
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={editTask.dueDate}
              onChange={handleEditDateChange}
              minDate={new Date()}
              component={{ OpenPickerIcon: TextField }}
              sx={{
                width: "15%",
                '& label.Mui-focused': {
                  color: 'green',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'green',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'red',
                  },
                  '&:hover fieldset': {
                    borderColor: 'yellow',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'green',
                  },
                  'input': {
                    color: 'blue',
                  }
                },
              }}

            />
          </LocalizationProvider>
          <Button onClick={handleEditTask} variant="outlined" color="primary">
            Save Changes
          </Button>
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {currentTasks.map(task => (
          <Box key={task._id} sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar>
                <SummarizeIcon />
              </Avatar>
              <Box>
                <div>{task.title} (Category - {task.category})</div>
                <div>{task.description} - Due: {new Date(task.dueDate).toLocaleDateString()}</div>
              </Box>
            </Box>

            <Box>
              <IconButton onClick={() => handleEditClick(task)}>
                <ModeEditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteTask(task._id)}>
                <DeleteIcon />
              </IconButton>
              <ToggleButtonGroup
                size="small"
                value={task.status}
                exclusive
                onChange={(event, newStatus) => handleStatusChange(task._id, newStatus)}
                aria-label="task status"
              >
                <ToggleButton value="pending" aria-label="pending">
                  Pending
                </ToggleButton>
                <ToggleButton value="completed" aria-label="completed">
                  Completed
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        ))}
        <Pagination
          count={Math.ceil(filteredAndSortedTasks.length / tasksPerPage)}
          page={currentPage}
          onChange={paginate}
          color="primary"
        />
      </Box>
    </Container>
  );
}

export default TodoListPage;
