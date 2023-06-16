import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { DataTable } from "react-native-paper";
import {
  Modal,
  Button,
  Provider,
  Portal,
  Dialog,
  IconButton,
  MD3Colors,
} from "react-native-paper";

import { getAllRecycleLocation } from "../features/recycle/recycleSlice";
import {
  createRecyclingHistory,
  deleteRecycleHistory,
  getAllRecyclingHistories,
  updateRecycleHistoryById,
} from "../features/recycle/recycleSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const UserHistoryTable = () => {
  const [editedRow, setEditedRow] = useState({});
  const [AddRow, setAddRow] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  const allRecyclingHistories = useSelector(
    (state) => state.recycle.allRecyclingHistories.data
  );

  console.log(allRecyclingHistories);

  const allRecycleLocations = useSelector(
    (state) => state.recycle.allRecycleLocations
  );

  useEffect(() => {
    dispatch(getAllRecycleLocation(user.token));
    dispatch(getAllRecyclingHistories(user.token));
  }, [dispatch, user.token, openEditDialog, AddRow]);

  return (
    <DataTable>
        <DataTable.Header>
            <DataTable.Title>User's Name</DataTable.Title>
            <DataTable.Title>Recycling Histories</DataTable.Title>
            <DataTable.Title>Actions</DataTable.Title>
            <DataTable.Title>Recycling Histories</DataTable.Title>

        </DataTable.Header>
        
    </DataTable>
    
  );
};

export default UserHistoryTable;
