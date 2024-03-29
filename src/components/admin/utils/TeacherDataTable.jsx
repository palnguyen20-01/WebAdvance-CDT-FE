import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle, DialogContent, DialogActions, DialogContentText,
  Button, TextField, CircularProgress, Box, Toolbar
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { vi } from 'date-fns/locale';
import EditIcon from '@mui/icons-material/Edit';
import { FaBan, FaCheck } from "react-icons/fa";
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AuthService from "@/auth/auth-service";
const TeacherDataTable = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loadingActive, setLoading] = useState(false);
  const [teachersData, setTeachers] = useState(null);
  const [editedFullname, setEditedFullname] = useState('');
  const [editedBirthday, setEditedBirthday] = useState(null);
  const [token, setToken] = useState('');
  const API_URL = process.env.SERVER_URL;

  React.useEffect(() => {
    getTeachers()
  }, [])

  const getTeachers = async () => {
    const user = AuthService.getCurrentUser();
    setToken(user.accessToken);
    await axios
      .get(API_URL + "/admin/getTeachers", {
        headers: {
          token: "Bearer " + user.accessToken,
        },
      })
      .then((res) => {
        if (res.data) {
          const teachersData = res.data.map(
            ({ password, image, role, ...rest }) => rest
          );
          setTeachers(teachersData);
        }
      });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'fullname', headerName: 'Họ tên', width: 150 },
    { field: 'birthday', headerName: 'Ngày sinh', width: 150 },
    {
      field: 'active',
      headerName: 'Active',
      width: 150,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleClickOpenActive(params.row)}>
            {params.row.active == "1" ? <FaCheck /> : <FaBan />}
          </Button>
        </div>
      ),
    },
    { field: 'verified', headerName: 'Xác thực', width: 100 },
    {
      field: 'edit',
      headerName: 'Chỉnh sửa',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => handleEditClick(params.row)}
        >
          <EditIcon />
        </Button>
      ),
    },
  ];

  const handleEditClick = (teacher) => {
    dayjs.extend(customParseFormat);
    setSelectedTeacher(teacher);
    setEditedFullname(teacher.fullname || '');
    setEditedBirthday(dayjs(teacher.birthday, 'DD-MM-YYYY') || '');
    setEditDialogOpen(true);

  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  //Chinh sua thong tin
  const handleEditSubmit = async () => {
    const result = await axios.post(
      API_URL + "/admin/updateUsers",
      {
        id: selectedTeacher.id,
        fullname: editedFullname,
        birthday: dayjs(editedBirthday).format('DD-MM-YYYY')
      },
      {
        headers: {
          token: "Bearer " + token,
        },
      }
    );

    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.id == selectedTeacher.id ?
          { ...teacher, fullname: editedFullname, birthday: dayjs(editedBirthday).format('DD-MM-YYYY') } : teacher
      )
    );

    handleEditDialogClose();
  };

  const handleClickOpenActive = (teacher) => {
    setSelectedTeacher(teacher);
    setActiveDialog(true);
  };

  const handleCloseActive = () => {
    setActiveDialog(false);
  };

  //Ban or Unban
  const handleActiveSubmit = async () => {

    const newActiveValue = selectedTeacher.active == "1" ? "0" : "1";
    const result = await axios.post(
      API_URL + "/admin/banUsers",
      {
        user: {
          ...selectedTeacher,
          active: newActiveValue,
        },
      },
      {
        headers: {
          token: "Bearer " + token,
        },
      }
    );
    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.id === selectedTeacher.id ? { ...teacher, active: newActiveValue } : teacher
      )
    );

    handleCloseActive();
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <div className="dataTable">
      {teachersData && teachersData.length > 0 ? (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={teachersData}
            columns={columns}
            initialState={{
              ...teachersData.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}

            slots={{
              toolbar: CustomToolbar,
            }}
            pageSizeOptions={[5, 10]}
            pagination
          />
        </div>
      ) : (
        <p>No accounts available.</p>
      )}
      {/* edit */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit account information</DialogTitle>

        <Box mt={-1}>
          <DialogContent>
            <Box mb={2}>
              <TextField
                label="Fullname"
                fullWidth
                value={editedFullname}
                onChange={(e) => setEditedFullname(e.target.value)}
              />
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs} locale={vi}>
              <DatePicker
                label="Birthday"
                value={dayjs(editedBirthday)}
                inputFormat="DD-MM-YYYY"
                onChange={(date) => setEditedBirthday(date)}
              />
            </LocalizationProvider>
          </DialogContent>
        </Box>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* active */}
      <Dialog open={activeDialog} onClose={handleCloseActive}>
        <DialogTitle>Ban or Unban account</DialogTitle>
        <DialogContent>
          {/* Edit form fields */}
          <DialogContentText >
            You want to {selectedTeacher ? (selectedTeacher.active == 1 ? "ban" : "unban") : ''} {selectedTeacher ? selectedTeacher.fullname : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseActive}>Cancel</Button>

          <Button onClick={handleActiveSubmit} color="primary">Save</Button>

        </DialogActions>
      </Dialog>
    </div>
  );
};



export default TeacherDataTable;