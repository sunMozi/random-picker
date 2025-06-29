import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

interface AdminDialogProps {
  open: boolean;
  onClose: () => void;
  names: { name: string; weight: number }[];
  onSave: (updatedNames: { name: string; weight: number }[]) => void;
}

const AdminDialog: React.FC<AdminDialogProps> = ({ open, onClose, names, onSave }) => {
  const [editedNames, setEditedNames] = useState(names);

  const handleNameChange = (index: number, field: 'name' | 'weight', value: string) => {
    const updatedNames = [...editedNames];
    if (field === 'weight') {
      updatedNames[index][field] = Math.max(0, parseInt(value, 10) || 0);
    } else {
      updatedNames[index][field] = value;
    }
    setEditedNames(updatedNames);
  };

  const handleAddEntry = () => {
    setEditedNames([...editedNames, { name: '', weight: 1 }]);
  };

  const handleRemoveEntry = (index: number) => {
    const updatedNames = editedNames.filter((_, i) => i !== index);
    setEditedNames(updatedNames);
  };

  const handleSave = () => {
    onSave(editedNames);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>管理学生名单</DialogTitle>
      <DialogContent>
        {editedNames.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <TextField
              label="姓名"
              value={entry.name}
              onChange={(e) => handleNameChange(index, 'name', e.target.value)}
              style={{ marginRight: '10px', flex: 1 }}
            />
            <TextField
              label="权重"
              type="number"
              value={entry.weight}
              onChange={(e) => handleNameChange(index, 'weight', e.target.value)}
              style={{ marginRight: '10px', width: '100px' }}
            />
            <Button color="secondary" onClick={() => handleRemoveEntry(index)}>
              删除
            </Button>
          </div>
        ))}
        <Button onClick={handleAddEntry} color="primary">
          添加学生
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave} color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminDialog;
