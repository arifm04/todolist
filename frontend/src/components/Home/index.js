import React, { useState } from 'react';
import {
  TextField, Button, Box, IconButton, ToggleButton, ToggleButtonGroup,
  Avatar,MenuItem
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

function TodoListPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    status: 'pending',
    category: ''
  });

  const [editingTask, setEditingTask] = useState(null);
  const [sortKey, setSortKey] = useState('dueDate');
  const [filter, setFilter] = useState({
    date: null,
    category: '',
    status: ''
  });

  const handleSortChange = (event) => {
    setSortKey(event.target.value);
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

  const handleAddTask = () => {
    if (editingTask) {
      setTasks(tasks.map(task => (task.id === editingTask.id ? { ...editingTask, ...newTask } : task)));
      setEditingTask(null);
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
    }
    setNewTask({ title: '', description: '', dueDate: new Date(), status: 'pending', category: '' });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({ ...task });
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleStatusChange = (taskId, event, newStatus) => {
    if (newStatus !== null) {
      setTasks(tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      }));
    }
  };

  const filteredTasks = tasks.filter(task => {
    return (filter.date ? new Date(task.dueDate).toDateString() === new Date(filter.date).toDateString() : true) &&
      (filter.category ? task.category === filter.category : true) &&
      (filter.status ? task.status === filter.status : true);
  });

  const sortedTasks = filteredTasks.slice().sort((a, b) => {
    if (sortKey === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortKey === 'status') {
      return a.status.localeCompare(b.status);
    }
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>Todo List</h1>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          select
          value={sortKey}
          label="Sort By"
          onChange={handleSortChange}
        >
          <MenuItem value="dueDate">Due Date</MenuItem>
          <MenuItem value="status">Status</MenuItem>
        </TextField>

        <TextField
          select
          label="Filter by Category"
          value={filter.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          sx={{width:'15%'}}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="personal">Personal</MenuItem>
          <MenuItem value="work">Work</MenuItem>
          <MenuItem value="shopping">Shopping</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          label="Title"
          name="title"
          value={newTask.title}
          required
          onChange={handleChange}
        />

        <TextField
          label="Description"
          name="description"
          value={newTask.description}
          onChange={handleChange}
        />

        <TextField
          select
          label="Category"
          name="category"
          value={newTask.category}
          onChange={handleChange}
          sx={{width:"15%"}}
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
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <Button onClick={handleAddTask} variant="contained" color="primary">
          {editingTask ? 'Update Task' : 'Add Task'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sortedTasks.map(task => (
          <Box key={task.id} sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar>
                <AssignmentIcon />
              </Avatar>
              <Box>
                <div>{task.title} (Category - {task.category})</div>
                <div>{task.description} - Due: {new Date(task.dueDate).toLocaleDateString()}</div>
              </Box>
            </Box>

            <Box>
              <IconButton onClick={() => handleEditTask(task)}>
                <ModeEditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>

              <ToggleButtonGroup
                size="small"
                value={task.status}
                exclusive
                onChange={(event, newStatus) => handleStatusChange(task.id, event, newStatus)}
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
      </Box>
    </div>
  );
}

export default TodoListPage;
