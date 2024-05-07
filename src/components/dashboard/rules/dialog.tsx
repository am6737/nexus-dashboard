import React, { useEffect, useState } from 'react';
import { creatRule } from '@/api/rule';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import toast from 'react-hot-toast';

export interface AddRuleDialogProps {
  open: boolean;
  handleClose: () => void;
}

const AddRuleDialog = ({ open, handleClose }: AddRuleDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    direction: 'inbound',
    protocol: 'any',
    portRange: 'any',
    allowedRole: 'any',
    action: 'allow',
  });

  const [ready, setReady] = useState(false); // save按钮是否可用

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isReady = Object.entries(formData).every(([key, value]) => {
      return key === 'description' || value !== '';
    });
    setReady(isReady);
  }, [formData]);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setLoading(true);
    // TODO 请求后端接口 延迟一秒loding 后期去掉
    setTimeout(() => {
      setLoading(false);

      creatRule({
        action: formData.action,
        description: formData.description,
        name: formData.name,
        port: formData.portRange,
        proto: formData.protocol,
        type: formData.direction,
      })
        .then((response) => {
          toast.success('Rule created success');
        })
        .catch((error) => {
          toast.error(`${error}`);
          console.error('Error fetching rules:', error);
        });
      handleClose();
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      sx={{ '& .MuiDialog-paper': { width: '500px', height: '600px' } }}
    >
      <DialogTitle>Add rule</DialogTitle>
      <DialogContent style={{ minWidth: '300px' }}>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{ marginBottom: '16px' }}
        />
        <TextField
          autoFocus
          margin="dense"
          name="description"
          label="Description"
          fullWidth
          value={formData.description}
          onChange={handleChange}
          style={{ marginBottom: '16px' }}
        />
        <FormControl fullWidth margin="dense" style={{ marginBottom: '16px' }}>
          <InputLabel id="direction-select-label">Direction</InputLabel>
          <Select
            id="direction-select-label"
            label="Direction"
            name="direction"
            value={formData.direction}
            disabled
            onChange={handleChange}
          >
            <MenuItem value="inbound">inbound</MenuItem>
            <MenuItem value="outbound">outbound</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense" style={{ marginBottom: '16px' }}>
          <InputLabel id="protocol-select-label">Protocol</InputLabel>
          <Select
            id="protocol-select-label"
            label="Protocol"
            name="protocol"
            value={formData.protocol}
            onChange={handleChange}
          >
            <MenuItem value="any">any</MenuItem>
            <MenuItem value="tcp">tcp</MenuItem>
            <MenuItem value="udp">udp</MenuItem>
            <MenuItem value="icmp">icmp</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Port or port range"
          fullWidth
          name="portRange"
          value={formData.portRange}
          onChange={handleChange}
          style={{ marginBottom: '16px' }}
        />
        <FormControl fullWidth margin="dense" style={{ marginBottom: '16px' }}>
          <InputLabel id="action-select-label">Action</InputLabel>
          <Select id="action-select-label" label="action" name="action" value={formData.action} onChange={handleChange}>
            <MenuItem value="allow">allow</MenuItem>
            <MenuItem value="deny">deny</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <LoadingButton onClick={handleSave} variant="contained" color="primary" disabled={!ready} loading={loading}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddRuleDialog;
