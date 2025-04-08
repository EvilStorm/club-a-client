import React, { useState, useCallback } from 'react';
import { Avatar, Box, Typography, Button, Dialog, DialogTitle, DialogContent, ListItem, ListItemAvatar, ListItemText, List } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';

const CardBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius / 2,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,
  minWidth: 200,
  width: '100%',
  maxWidth: 300, 
}));

const UserInfoComponent = ({ user }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const allJoinedClubs = [
    { id: 1, name: '정말긴클럽이름을표시해야하는데제한된영역때문에다보이지않는경우1', path: '/club/1', clubEmblem: 'https://via.placeholder.com/50/FF0000/FFFFFF?Text=A' },
    { id: 2, name: '짧은 클럽2', path: '/club/2', clubEmblem: 'https://via.placeholder.com/50/00FF00/FFFFFF?Text=B' },
    { id: 3, name: '중간 길이 클럽 이름3', path: '/club/3', clubEmblem: 'https://via.placeholder.com/50/0000FF/FFFFFF?Text=C' },
    { id: 4, name: '또 다른 긴 이름의 클럽4', path: '/club/4', clubEmblem: 'https://via.placeholder.com/50/FFFF00/000000?Text=D' },
    { id: 5, name: '주말 클럽5', path: '/club/5', clubEmblem: 'https://via.placeholder.com/50/00FFFF/000000?Text=E' },
    { id: 6, name: '새로운 클럽6', path: '/club/6', clubEmblem: 'https://via.placeholder.com/50/FF00FF/000000?Text=F' },
    { id: 7, name: '아주긴클럽이름7', path: '/club/7', clubEmblem: 'https://via.placeholder.com/50/C0C0C0/000000?Text=G' },
    { id: 8, name: '클럽 8', path: '/club/8', clubEmblem: 'https://via.placeholder.com/50/800000/FFFFFF?Text=8' },
    { id: 9, name: '클럽 9', path: '/club/9', clubEmblem: 'https://via.placeholder.com/50/008000/FFFFFF?Text=9' },
    { id: 10, name: '클럽 10', path: '/club/10', clubEmblem: 'https://via.placeholder.com/50/000080/FFFFFF?Text=10' },
  ];

  const [openDialog, setOpenDialog] = useState(false);

  const handleClubClick = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (!user) {
    return <Typography>사용자 정보가 없습니다.</Typography>;
  }

  return (
    <CardBox>
      {/* 왼쪽: 아바타 및 이름 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 3, flexShrink: 0 }}>
        <Avatar
          alt={user.name}
          src={user.imageUrl}
          sx={{ width: 60, height: 60, borderRadius: '50%' }}
        />
        <Typography variant="subtitle1" mt={1} textAlign="center">
          {user.name}
        </Typography>
      </Box>

      {/* 오른쪽: 가입 클럽 수 표시 및 팝업 트리거 */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" fontWeight="bold" mr={1} onClick={handleOpenDialog} sx={{ cursor: 'pointer' }}>
          가입 클럽:
        </Typography>
        <Typography variant="body2" onClick={handleOpenDialog} sx={{ cursor: 'pointer' }}>
          {allJoinedClubs.length} 개
        </Typography>
      </Box>

      {/* 가입 클럽 리스트 팝업 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth={false} sx={{ '& .MuiDialog-paper': { width: '400px' } }}> {/* maxWidth false 및 직접 width 지정 */}
        <DialogTitle>가입한 클럽 목록</DialogTitle>
        <DialogContent sx={{ height: '40vh', overflowY: 'auto' }}>
          <List>
            {allJoinedClubs.map((club) => (
              <ListItem key={club.id} button onClick={() => handleClubClick(club.path)} sx={{ padding: theme.spacing(1) }}>
                <ListItemAvatar sx={{ minWidth: 30, mr: 1 }}>
                  <Avatar src={club.clubEmblem} alt={club.name} sx={{ width: 24, height: 24 }} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {club.name}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </CardBox>
  );
};

// props 타입 정의
UserInfoComponent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    extendsInfo: PropTypes.shape({
      userId: PropTypes.number.isRequired,
      startedAt: PropTypes.string,
      hands: PropTypes.number,
      ntr: PropTypes.number,
      updatedAt: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    }).isRequired,
    accountId: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    birthdayDate: PropTypes.string,
    gender: PropTypes.number,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserInfoComponent;