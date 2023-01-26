import express from 'express';
import {
  addToPlaylist,
  changePassword,
  deleteMyProfile,
  deleteUser,
  forgetPassword,
  getAllUsers,
  getMyProfile,
  login,
  logout,
  register,
  removeFromPlaylist,
  resetPassword,
  updateProfile,
  updateprofilepicture,
  updateUserRole,
} from '../controllers/userController.js';
import {authorizeAdmin, isAuthenticated} from '../middlewares/auth.js';
import singleUpload from '../middlewares/multer.js';

const router = express.Router();

router.get('/', (req, res) => { res.send(`API is running...`); });

router.route('/register').post(singleUpload, register);

router.route('/login').post(login);

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticated, getMyProfile);

router.route('/me').delete(isAuthenticated, deleteMyProfile);

router.route('/change-password').put(isAuthenticated, changePassword);

router.route('/update-profile').put(isAuthenticated, updateProfile);

router.route('/update-profile-picture')
    .put(isAuthenticated, singleUpload, updateprofilepicture);

router.route('/forget-password').post(forgetPassword);
router.route('/resetpassword/:token').put(resetPassword);

router.route('/add-to-playlist').post(isAuthenticated, addToPlaylist);

router.route('/remove-from-playlist')
    .delete(isAuthenticated, removeFromPlaylist);

router.route('/admin/users').get(isAuthenticated, authorizeAdmin, getAllUsers);

router.route('/admin/user/:id')
    .put(isAuthenticated, authorizeAdmin, updateUserRole)
    .delete(isAuthenticated, authorizeAdmin, deleteUser);

export default router;
