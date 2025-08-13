// API to get direct referral active/inactive counts
import axios from 'axios';

export const getDirectReferralStatus = async (userId) => {
  try {
    const res = await axios.get(`https://startraders-fullstack-9ayr.onrender.com/api/user/direct-referral-status/${userId}`);
    if (res.data.success) {
      return {
        active: res.data.activeCount || 0,
        inactive: res.data.inactiveCount || 0
      };
    }
    return { active: 0, inactive: 0 };
  } catch {
    return { active: 0, inactive: 0 };
  }
};
