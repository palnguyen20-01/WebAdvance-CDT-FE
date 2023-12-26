import React, { useState, useEffect } from "react";
import authService from "@/auth/auth-service";
import {
    Dialog,
    DialogTitle, DialogContent, DialogActions, Box, TextField,
    Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
    DataGrid, GridColDef, GridToolbar,
    GridToolbarContainer, GridToolbarExport, useGridApiRef
} from '@mui/x-data-grid';
import axios from 'axios';


export default function GradeBoardStudent(props) {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [currentId, setId] = useState(null);
    const [currentToken, setToken] = useState(null);
    const [gradeData, setGradeData] = useState([]);
    const [filterGradeData, setFilterGradeData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [gradeStructure, setGradeStructure] = useState(null);
    const [filterGradeStructure, setFilterGradeStructure] = useState(null);
    const [sumValues, setSumValues] = useState([]);

    const API_URL = process.env.SERVER_URL;

    useEffect(() => {
        const takeUser = () => {
            const user = authService.getCurrentUser();
            if (user) {
                setCurrentUser(user.user[0].fullname);
                setId(user.user[0].id);
                setToken(user.accessToken);
            }
        };
        takeUser();

    }, []);

    useEffect(() => {
        if (currentToken) {
            getGrade(props.classId);

        }
    }, [currentToken]);

    //create columns
    useEffect(() => {
        if (gradeData.length > 0) {
            const firstItem = gradeData[0];
            const columns = Object.keys(firstItem).filter((key) => key.toLowerCase() !== "index").map((key) => ({
                field: key,
                headerName: key.charAt(0).toUpperCase() + key.slice(1),
                width: 150,
            }));
            columns.push(
                {
                    field: 'edit',
                    headerName: 'Review mark',
                    width: 120,
                    renderCell: (params) => (
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleEditClick(params.row, params.field)}
                        >
                            <EditIcon />
                        </Button>
                    ),
                },
            )
            setColumns(columns)
        }
    }, [gradeData]);

    //count sum
    useEffect(() => {
        if (gradeStructure != null && gradeStructure.length > 0) {
            let gradeStructureObj = filterGradeStructure[0];
            console.log(JSON.stringify(gradeStructureObj), " GRADE COLUMN")
            const newGrade = filterGradeData.map(obj => {
                let newObj = { ...obj };
                newObj.sum = Object.keys(gradeStructureObj).reduce((sum, key) => {
                    if (newObj[key] !== null && newObj[key] !== undefined && !isNaN(newObj[key])) {
                        return sum + (newObj[key] * gradeStructureObj[key] / 100);
                    } else {
                        return sum;
                    }
                }, 0);
                return newObj;
            });
            const sumValues = newGrade.map(obj => obj.sum);
            if (gradeData.length > 0 && sumValues.length > 0) {
                const newGradeData = gradeData.map((item, index) => {
                    return {
                        ...item,
                        sum: sumValues[index],
                    };
                });
                setGradeData(newGradeData);
            }

        }
    }, [filterGradeStructure]);


    const getGrade = async (idClass) => {
        await axios.post(
            API_URL + "/class/student/getGrades", {
            idClass: idClass,
            idUser: currentId
        },
            {
                headers: {
                    token: "Bearer " + currentToken,
                },
            }
        ).then((res) => {
            if (res.data) {
                const structure = res.data.map(obj => {
                    let newObj = { ...obj };
                    delete newObj.id;
                    delete newObj.fullname;
                    return newObj;
                });
                setFilterGradeData(structure)
                setGradeData(res.data);
            }
        })

        await axios
            .get(API_URL + "/class/student/getGradeStructures/" + idClass, {
                headers: {
                    token: "Bearer " + currentToken,
                },
            })
            .then((res) => {
                if (res.data) {
                    const newResult = []
                    if (res.data.length > 0) {
                        const structure = res.data.map(obj => {
                            let newObj = { ...obj };
                            delete newObj.id;
                            return newObj;
                        });
                        setFilterGradeStructure(structure);


                        Object.entries(res.data[0]).forEach(([key, value], index) => {
                            if (key !== 'id') {
                                newResult.push({ id: index + 1, percentage: key, value });
                            }
                        });
                    }
                    setGradeStructure(newResult);
                }
            });

    }

    const handleEditClick = (data, field) => {
        setSelectedGrade(data);
        setSelectedColumn(field);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    const handleEditSubmit = async () => {
        const result = await axios.post(
            API_URL + "/class/requestReview",
            {
                id: currentId,
                data: selectedGrade
            },
            {
                headers: {
                    token: "Bearer " + currentToken,
                },
            }
        );

        handleEditDialogClose();
    };

    const handleTextFieldChange = (field, value) => {
        setSelectedGrade((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div
            style={{
                height: 450,
                width: "100%",
            }}
        >
            <DataGrid
                rows={gradeData}
                columns={columns}
                initialState={{
                    ...gradeData.initialState,
                    pagination: { paginationModel: { pageSize: 10 } },
                }}

                pageSizeOptions={[5, 10]}
                pagination
            />
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <DialogTitle>Edit score</DialogTitle>

                <Box mt={-1}>
                    <DialogContent>
                        <Box mb={2}>
                            {selectedColumn ? columns
                                .filter(column => column.field !== 'edit' && column.field !== 'id' && column.field !== 'fullname' && column.field !== 'sum')
                                .map((column) => (
                                    <Box mb={2} key={column.field}>
                                        <TextField
                                            label="Expectation Score"
                                            fullWidth
                                            value={selectedGrade ? selectedGrade[column.headerName] : ''}
                                            onChange={(e) => handleTextFieldChange(column.field, e.target.value)}
                                        />
                                        <TextField
                                            style={{ marginTop: 30 }}
                                            label="Message"
                                            fullWidth
                                            multiline
                                            placeholder="Reason why you submit this review"
                                            onChange={(e) => handleTextFieldChange(column.field, e.target.value)}
                                        />
                                    </Box>
                                ))
                                : null}
                        </Box>
                    </DialogContent>
                </Box>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
