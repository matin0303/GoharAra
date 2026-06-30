// components/RoleSelect.tsx
'use client';

import * as React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import { useUpdateUserRole } from '@/hook/useUser';
import { UserRole } from '@/types/api.types';

interface RoleSelectProps {
  userId: number;
  currentRole: string;
}

const roleOptions = [
  { value: 'user', label: 'کاربر' },
  { value: 'admin', label: 'ادمین' },
  { value: 'manager', label: 'مدیر' },
];

export default function RoleSelect({ userId, currentRole }: RoleSelectProps) {
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();

  const handleRoleChange = (event: SelectChangeEvent) => {
    const newRole = event.target.value as UserRole;
    
    updateRole(
      { data:{role: newRole } ,id: userId });
  };

  return (
    <FormControl 
      size="small" 
      sx={{ 
        minWidth: 120,
        fontFamily: 'kalameh !important',
        fontWeight: 'bold'
      }}
      disabled={isUpdatingRole}
    >
      <Select
        value={currentRole}
        onChange={handleRoleChange}
        displayEmpty
        sx={{
          fontFamily: 'kalameh !important',
          fontWeight: 'bold',
          '& .MuiSelect-select': {
            py: 1,
          }
        }}
        endAdornment={isUpdatingRole ? <CircularProgress size={20} /> : null}
      >
        {roleOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              fontFamily: 'kalameh !important',
              fontWeight: 'bold',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}