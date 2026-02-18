import axios from 'axios';
import Toast from 'react-native-toast-message';

export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

/* 
   Sometimes React Query retries 3 times.

   You might get 3 Toasts.

   To avoid that:
*/
let isToastShowing = false;

// 🔥 GLOBAL RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  response => {
    // If response is successful → just return it
    return response;
  },
  error => {
    if (!isToastShowing) {
      isToastShowing = true;
      // Extract message safely
      const data = error.response?.data as any;

      const message =
        data?.message ||
        data?.error ||
        data?.msg ||
        error.message ||
        'Something went wrong';

      // Show Toast globally
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
        position: 'top',
        onHide: () => {
          isToastShowing = false;
        },
      });
    }

    // VERY IMPORTANT:
    // Still reject so React Query knows it's an error
    return Promise.reject(error);
  },
);
