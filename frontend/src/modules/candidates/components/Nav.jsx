import { useEffect, useRef, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FormatDateTime } from "../../../common/helpers";
import { useAuth } from "../../../hooks/useAuth";
import useClickOutside from "../../../hooks/useClickOutside";
import { useLoading } from "../../../hooks/useLoading";
import { signalrConnection } from "../../../httpClient/signalRConnection";
import {
  getNotifications,
  readNotification,
} from "../../../services/notification";

export const Nav = () => {
  const { setIsAuthenticated, user, isAuthenticated } = useAuth();
  const [openJobMenu, setOpenJobMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openNotif, setOpenNotif] = useState(false);
  const unreadCount = notifications.filter((notif) => !notif.isRead).length;
  const { setIsLoading } = useLoading();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("You have been signed out");
    signalrConnection.stop();
  };

  const jobMenuRef = useRef();
  useClickOutside(jobMenuRef, () => {
    setOpenJobMenu(false);
  });

  const notifRef = useRef();
  useClickOutside(notifRef, () => {
    setOpenNotif(false);
  });

  const fetchNotification = async () => {
    if (user.type !== "candidate") return;
    await getNotifications(user.id)
      .then((response) => {
        setNotifications(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  signalrConnection.on("ReceiveNotification", () => {
    fetchNotification();
  });

  const signalrStart = async () => {
    try {
      await signalrConnection.start();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    signalrStart();
  }, [signalrConnection]);

  useEffect(() => {
    fetchNotification();
  }, [user]);

  const handleNotificationClick = async (notificationId) => {
    readNotification(notificationId)
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        fetchNotification();
      });
  };

  

  return (
    <div className="h-[80px] w-full bg-red-500 flex justify-between items-center px-4 text-white font-semibold text-lg">
      <div className=" flex items-center justify-start gap-4">
        <Link to="/dashboard">
          <svg
            width="180"
            height="80"
            viewBox="0 0 180 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_4_13)">
              <line
                x1="115.144"
                y1="48.1162"
                x2="124.644"
                y2="48.1162"
                stroke="white"
              />
              <line
                x1="127.358"
                y1="48.1162"
                x2="135.502"
                y2="48.1162"
                stroke="white"
              />
              <line
                x1="138.216"
                y1="48.1162"
                x2="147.716"
                y2="48.1162"
                stroke="white"
              />
              <line
                x1="150.431"
                y1="48.1162"
                x2="158.574"
                y2="48.1162"
                stroke="white"
              />
              <line
                x1="161.288"
                y1="48.1162"
                x2="169.432"
                y2="48.1162"
                stroke="white"
              />
              <path
                d="M119.215 45.8937H113.293C112.066 45.8937 111.072 47.1126 111.072 48.6162C111.072 50.1198 112.066 51.3387 113.293 51.3387H119.215"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M165.36 51.3387H171.282C172.509 51.3387 173.503 50.1198 173.503 48.6162C173.503 47.1127 172.509 45.8937 171.282 45.8937H165.36"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M117.515 40.5383C116.818 40.5383 116.197 40.413 115.653 40.1625C115.119 39.9121 114.7 39.5636 114.395 39.1171C114.101 38.6597 113.954 38.1479 113.954 37.5816V35.164C113.954 34.5651 114.101 34.0315 
        114.395 33.5632C114.7 33.0949 115.119 32.7301 115.653 32.4688C116.186 32.2074 116.796 32.0767 117.482 32.0767C118.125 32.0767 118.696 32.1693 119.197 32.3544C119.698 32.5395 120.085 32.8009 120.357 33.1385C120.64 33.4652 120.782 33.8409 120.782 34.2656C120.782 34.6032 120.64 34.87 120.357 35.066C120.085 35.2512 119.725 35.3274 119.279 35.2947C119.279 34.8156 119.116 34.4235 118.789 34.1186C118.462 
        33.8137 118.043 33.6612 117.531 33.6612C117.019 33.6612 116.6 33.8082 116.273 34.1023C115.947 34.3963 115.783 34.7774 115.783 35.2457V37.4673C115.783 37.9029 115.947 38.2568 116.273 38.529C116.611 38.8013 117.041 38.9374 117.564 38.9374C118.076 38.9374 118.495 38.7904 118.822 38.4964C119.148 38.1915 119.312 37.8049 119.312 37.3366L119.54 37.3203C119.921 37.3203 120.232 37.4183 120.471 37.6143C120.711 37.7994 
        120.831 38.0444 120.831 38.3494C120.831 38.7741 120.689 39.1552 120.406 39.4928C120.134 39.8195 119.742 40.0754 119.23 40.2606C118.729 40.4457 118.157 40.5383 117.515 40.5383ZM125.408 40.5383C124.711 40.5383 124.08 40.413 123.514 40.1625C122.958 39.9012 122.517 39.5473 122.19 39.1008C121.875 38.6543 121.717 38.1479 121.717 37.5816V35.164C121.717 34.5869 121.875 34.0641 122.19 33.5959C122.506 33.1276 122.942 32.7573 
        123.497 32.4851C124.063 32.2128 124.701 32.0767 125.408 32.0767C126.116 32.0767 126.748 32.2128 127.303 32.4851C127.87 32.7573 128.311 33.1276 128.626 33.5959C128.942 34.0641 129.1 34.5869 129.1 35.164V37.5816C129.1 38.1479 128.937 38.6543 128.61 39.1008C128.294 39.5473 127.853 39.9012 127.287 40.1625C126.732 40.413 126.105 40.5383 125.408 40.5383ZM125.408 38.9538C125.986 38.9538 126.443 38.8231 126.781 38.5617C127.118 38.2895 127.287 37.9247 
        127.287 37.4673V35.2457C127.287 34.7665 127.118 34.38 126.781 34.0859C126.443 33.7919 125.986 33.6449 125.408 33.6449C124.831 33.6449 124.374 33.7919 124.036 34.0859C123.699 34.38 123.53 34.7665 123.53 35.2457V37.4673C123.53 37.9247 123.699 38.2895 124.036 38.5617C124.374 38.8231 124.831 38.9538 125.408 38.9538ZM130.579 33.5305C130.579 32.5613 131.162 32.0767 132.327 32.0767V33.0732C132.196 33.2147 132.071 33.3835 131.951 33.5795L132.049 
        33.6449C132.365 33.1657 132.779 32.7846 133.291 32.5014C133.813 32.2183 134.385 32.0767 135.006 32.0767C135.572 32.0767 136.067 32.202 136.492 32.4524C136.917 32.692 137.244 33.0296 137.472 33.4652C137.712 33.9008 137.832 34.3854 137.832 34.919V39.3621C137.832 39.776 137.679 40.0754 137.374 40.2606C137.069 40.4457 136.612 40.5383 136.002 40.5383V35.164C136.002 34.7175 135.866 34.3582 135.594 34.0859C135.332 33.8028 134.946 33.6612 134.434 33.6612C133.868 33.6612 133.389 33.8409 132.996 34.2003C132.604 34.5487 132.408 34.9789 132.408 35.4907V39.3621C132.408 39.776 132.256 40.0754 131.951 40.2606C131.657 40.4457 131.2 40.5383 130.579 40.5383V33.5305ZM139.751 33.5305C139.751 32.5613 140.334 32.0767 141.499 32.0767V33.0732C141.369 33.2147 141.243 33.3835 141.124 33.5795L141.222 33.6449C141.537 33.1657 141.951 32.7846 142.463 32.5014C142.986 32.2183 143.557 32.0767 144.178 32.0767C144.744 32.0767 145.24 32.202 145.665 32.4524C146.089 32.692 146.416 33.0296 146.645 33.4652C146.884 33.9008 147.004 34.3854 147.004 34.919V39.3621C147.004 39.776 146.852 40.0754 146.547 40.2606C146.242 40.4457 145.784 40.5383 145.175 40.5383V35.164C145.175 34.7175 145.038 34.3582 144.766 34.0859C144.505 33.8028 144.118 33.6612 143.606 33.6612C143.04 33.6612 142.561 33.8409 142.169 34.2003C141.777 34.5487 141.581 34.9789 141.581 35.4907V39.3621C141.581 39.776 141.428 40.0754 141.124 40.2606C140.83 40.4457 140.372 40.5383 139.751 40.5383V33.5305ZM152.387 40.5383C151.723 40.5383 151.113 40.4076 150.557 40.1462C150.013 39.8849 149.583 39.5255 149.267 39.0681C148.951 38.5998 148.793 38.0771 148.793 37.4999V35.2457C148.793 34.6468 148.957 34.1077 149.283 33.6285C149.61 33.1494 150.051 32.7737 150.606 32.5014C151.162 32.2183 151.761 32.0767 152.403 32.0767C153.046 32.0767 153.628 32.2074 154.151 32.4688C154.685 32.7301 155.104 33.1004 155.409 33.5795C155.725 34.0478 155.883 34.576 155.883 35.164V36.1278C155.883 36.3456 155.801 36.5307 155.638 36.6832C155.474 36.8356 155.267 36.9119 155.017 36.9119H150.574V37.3856C150.574 37.8865 150.726 38.2895 151.031 38.5944C151.347 38.8993 151.804 39.0518 152.403 39.0518C152.991 39.0518 153.432 38.9265 153.726 38.6761C154.02 38.4147 154.167 38.0717 154.167 37.647C154.233 
        37.6361 154.331 37.6306 154.461 37.6306C154.832 37.6306 155.126 37.7177 155.344 37.892C155.572 38.0553 155.687 38.2895 155.687 38.5944C155.687 38.9211 155.54 39.2369 155.246 39.5418C154.951 39.8358 154.549 40.0754 154.037 40.2606C153.536 40.4457 152.986 40.5383 152.387 40.5383ZM154.2 35.5561V35.164C154.2 34.674 154.031 34.2819 153.694 33.9879C153.367 33.683 152.931 33.5305 152.387 33.5305C151.842 33.5305 151.401 33.683 151.064 33.9879C150.737 34.2819 150.574 34.674 150.574 35.164V35.5561H154.2ZM161 40.5383C160.303 40.5383 159.683 40.413 159.138 40.1625C158.604 39.9121 158.185 39.5636 157.88 39.1171C157.586 38.6597 157.439 38.1479 157.439 37.5816V35.164C157.439 34.5651 157.586 34.0315 157.88 33.5632C158.185 33.0949 158.604 32.7301 159.138 32.4688C159.672 32.2074 160.282 32.0767 160.968 32.0767C161.61 32.0767 162.182 32.1693 162.683 32.3544C163.184 32.5395 163.57 32.8009 163.843 33.1385C164.126 33.4652 164.267 33.8409 164.267 34.2656C164.267 34.6032 164.126 34.87 163.843 
        35.066C163.57 35.2512 163.211 35.3274 162.764 35.2947C162.764 34.8156 162.601 34.4235 162.274 34.1186C161.948 33.8137 161.528 33.6612 161.017 33.6612C160.505 33.6612 160.086 33.8082 159.759 34.1023C159.432 34.3963 159.269 34.7774 159.269 35.2457V37.4673C159.269 37.9029 159.432 38.2568 159.759 38.529C160.096 38.8013 160.527 38.9374 161.049 38.9374C161.561 38.9374 161.98 38.7904 162.307 38.4964C162.634 38.1915 162.797 37.8049 162.797 37.3366L163.026 37.3203C163.407 37.3203 163.717 37.4183 163.957 37.6143C164.197 37.7994 164.316 38.0444 164.316 38.3494C164.316 38.7741 164.175 39.1552 163.892 39.4928C163.619 39.8195 163.227 40.0754 162.715 40.2606C162.215 40.4457 161.643 40.5383 161 40.5383ZM169.174 40.5383C168.324 40.5383 167.692 40.2932 167.279 39.8032C166.876 39.3131 166.674 38.6815 166.674 37.9083V33.6122H165.041C165.041 33.1439 165.133 32.7955 165.318 32.5668C165.504 32.3381 165.754 32.2237 166.07 32.2237H166.691V30.8026C166.691 30.3888 166.838 
        30.0893 167.132 29.9042C167.437 29.719 167.889 29.6265 168.487 29.6265V32.2237H170.66C170.66 32.7138 170.562 33.0677 170.366 33.2855C170.17 33.5033 169.86 33.6122 169.435 33.6122H168.504V37.843C168.504 38.235 168.58 38.5182 168.732 38.6924C168.885 38.8557 169.152 38.9374 169.533 38.9374C169.914 38.9374 170.29 38.834 170.66 38.6271C170.758 38.7142 170.829 38.8231 170.872 38.9538C170.927 39.0844 170.954 39.2206 170.954 39.3621C170.954 39.6671 170.796 39.9393 170.48 40.1789C170.165 40.4185 169.729 40.5383 169.174 40.5383Z"
                fill="white"
              />
              <path
                d="M9.54623 51.72C7.96718 51.72 6.55148 51.4205 5.29913 50.8216C4.06493 50.2045 3.10298 49.3605 2.41328 48.2897C1.72358 47.2007 1.37873 45.9665 1.37873 44.587V39.2237C1.37873 37.8443 1.7145 36.6283 2.38605 35.5756C3.07575 34.5047 4.02863 33.6698 5.24468 33.0709C6.47888 32.4719 7.87643 32.1724 9.43733 32.1724C11.0164 32.1724 12.4139 32.4175 13.63 32.9075C14.846 33.3794 15.7898 34.051 16.4614 34.9222C17.1511 35.7752 17.4959 36.7553 17.4959 37.8625C17.4959 38.4977 17.2872 38.9968 16.8698 39.3598C16.4523 39.7047 15.8897 39.8771 15.1818 39.8771C14.837 39.8771 14.5103 39.8408 14.2017 39.7682C14.2562 39.496 14.2834 39.0876 14.2834 38.5431C14.2834 37.5086 13.8296 36.6646 12.9221 36.0112C12.0328 35.3578 10.8712 35.0311 9.43733 35.0311C8.02163 35.0311 6.8691 35.4213 5.97975 36.2017C5.0904 36.9822 4.64573 37.9895 4.64573 39.2237V44.587C4.64573 45.8394 5.09948 46.8649 6.00698 47.6635C6.91448 48.4439 8.09423 48.8342 9.54623 48.8342C10.9801 48.8342 12.1508 48.5165 13.0583 47.8813C13.9658 47.2279 14.4195 46.3839 14.4195 45.3494C14.4195 44.8412 14.3923 44.4509 14.3378 44.1787C14.6282 44.1061 14.9459 44.0698 15.2907 44.0698C15.9986 44.0698 16.5612 44.2604 16.9787 44.6415C17.4143 45.0227 17.6321 45.5399 17.6321 46.1933C17.6321 47.2642 17.2872 48.2171 16.5975 49.052C15.926 49.8869 14.9731 50.5403 13.7389 51.0122C12.5047 51.4841 11.1071 51.72 9.54623 51.72ZM22.058 51.72C21.3502 51.6293 20.7966 51.3752 20.3973 50.9577C19.998 50.5221 19.7984 49.9958 19.7984 49.3787C19.7984 48.8886 19.9163 48.3986 20.1523 47.9085L26.4685 33.2342C26.777 32.5264 27.3125 32.1724 28.0748 32.1724C28.8189 32.1724 29.3543 32.5264 29.681 33.2342L35.9972 47.9085C36.215 48.4167 36.3239 48.8977 36.3239 49.3514C36.3239 49.9867 36.1243 50.5221 35.725 50.9577C35.3257 51.3752 34.7721 51.6293 34.0643 51.72L31.7501 46.3839H24.3722L22.058 51.72ZM30.7428 43.5525L27.5847 35.63L27.2852 35.7389L27.9114 37.2907L25.3795 43.5525H30.7428ZM39.1683 33.9148C39.1683 33.4974 39.3226 33.1435 39.6311 32.8531C39.9578 32.5627 40.3571 32.4175 40.829 32.4175H48.1526C50.0402 32.4175 51.5194 32.9347 52.5902 33.9693C53.6792 35.0038 54.2237 36.4286 54.2237 38.2436C54.2237 39.3145 53.9969 40.222 53.5431 40.9661C53.0894 41.6921 52.4087 
                    42.2729 51.5012 42.7085V42.8174C52.2998 43.1623 52.9079 43.6795 53.3253 44.3693C53.7428 45.0408 53.9515 45.8757 53.9515 46.874V49.2153C53.9515 50.0321 53.6702 50.6582 53.1075 51.0938C52.563 51.5113 51.7553 51.72 50.6845 51.72V47.0101C50.6845 45.0499 49.8496 44.0698 48.1798 44.0698H42.4081V49.2153C42.4081 50.0321 42.1268 50.6582 41.5641 51.0938C41.0196 51.5113 40.221 51.72 39.1683 51.72V33.9148ZM48.0164 41.2656C48.9239 41.2656 49.6318 41.0024 50.14 40.4761C50.6663 39.9316 50.9295 39.1783 50.9295 38.2164C50.9295 36.2199 49.9585 35.2217 48.0164 35.2217H42.4081V41.2656H48.0164ZM57.3538 33.9148C57.3538 33.4974 57.508 33.1435 57.8166 32.8531C58.1433 32.5627 58.5426 32.4175 59.0145 32.4175H71.1296C71.1296 33.3976 70.9481 34.1145 70.5851 34.5682C70.2403 35.022 69.6776 35.2489 68.8972 35.2489H60.6208V40.4488H67.9987C67.9987 41.4289 67.8172 42.1459 67.4542 42.5996C67.1094 43.0534 66.5558 43.2802 65.7935 43.2802H60.6208V48.6436H69.4689C70.2312 48.6436 70.7848 48.8705 71.1296 49.3242C71.4926 49.778 71.6741 50.4949 71.6741 51.475H59.0145C58.5426 51.475 58.1433 51.3298 57.8166 51.0394C57.508 50.749 57.3538 50.386 57.3538 49.9504V33.9148ZM74.4757 33.9148C74.4757 33.4974 74.63 33.1435 74.9385 32.8531C75.2652 32.5627 75.6645 32.4175 76.1364 32.4175H88.2516C88.2516 33.3976 88.0701 34.1145 87.7071 34.5682C87.3622 35.022 86.7996 35.2489 86.0191 35.2489H77.7427V40.4488H85.1207C85.1207 41.4289 84.9392 42.1459 84.5762 42.5996C84.2313 43.0534 83.6778 43.2802 82.9155 43.2802H77.7427V48.6436H86.5908C87.3531 48.6436 87.9067 48.8705 88.2516 49.3242C88.6146 49.778 88.7961 50.4949 88.7961 51.475H76.1364C75.6645 51.475 75.2652 51.3298 74.9385 51.0394C74.63 50.749 74.4757 50.386 74.4757 49.9504V33.9148ZM91.5977 33.9148C91.5977 33.4974 91.752 33.1435 92.0605 32.8531C92.3872 32.5627 92.7865 32.4175 93.2584 32.4175H100.582C102.47 32.4175 103.949 32.9347 105.02 33.9693C106.109 35.0038 106.653 36.4286 106.653 38.2436C106.653 39.3145 106.426 40.222 105.972 40.9661C105.519 41.6921 104.838 42.2729 103.931 42.7085V42.8174C104.729 43.1623 105.337 43.6795 105.755 44.3693C106.172 45.0408 106.381 45.8757 106.381 46.874V49.2153C106.381 50.0321 106.1 50.6582 105.537 51.0938C104.992 51.5113 104.185 
                    51.72 103.114 51.72V47.0101C103.114 45.0499 102.279 44.0698 100.609 44.0698H94.8375V49.2153C94.8375 50.0321 94.5561 50.6582 93.9935 51.0938C93.449 51.5113 92.6504 51.72 91.5977 51.72V33.9148ZM100.446 41.2656C101.353 41.2656 102.061 41.0024 102.569 40.4761C103.096 39.9316 103.359 39.1783 103.359 38.2164C103.359 36.2199 102.388 35.2217 100.446 35.2217H94.8375V41.2656H100.446Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_4_13">
                <rect width="180" height="80" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </Link>
        <Link
          to="/dashboard"
          className="hover:border-b-2 hover:border-b-white h-full p-2"
        >
          Home
        </Link>
        <div className=" h-full relative" ref={jobMenuRef}>
          <div
            className="hover:border-b-2 hover:border-b-white p-2 hover:cursor-pointer"
            onClick={() => {
              setOpenJobMenu(!openJobMenu);
            }}
          >
            Jobs
          </div>
          <div
            className={`rounded-md p-2 shadow-md w-[160px] absolute top-[120%] text-black bg-white z-20 ${
              !openJobMenu && "hidden"
            }`}
          >
            <Link
              to="/applied-jobs"
              className="rounded-md block p-2 bg-slate-200 hover:bg-slate-300 hover:text-red-500 transition-all"
            >
              Applied Jobs
            </Link>
          </div>
        </div>
        <Link
          to="/profile"
          className="hover:border-b-2 hover:border-b-white h-full p-2"
        >
          Profile
        </Link>
      </div>
      <div className="flex justify-end items-center gap-2">
        <div className="relative" ref={notifRef}>
          <div
            className="relative  hover:cursor-pointer"
            onClick={() => {
              setOpenNotif(!openNotif);
            }}
          >
            <IoIosNotifications size={24} />
            {unreadCount > 0 && (
              <div className="absolute -right-2 -top-2 bg-black text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </div>
          <div
            className={`absolute p-1 right-0 z-20 shadow-md rounded-sm text-black bg-white min-w-[200px] ${
              !openNotif && "hidden"
            }`}
          >
            <div>
              {notifications.length !== 0 ? (
                <div className="text-sm font-normal flex flex-col gap-1 max-h-[300px] overflow-auto">
                  {notifications.map((notif, index) => (
                    <div
                      key={index}
                      className={`${
                        notif.isRead ? "" : "bg-slate-200"
                      } shadow-sm p-2 rounded-lg hover:cursor-pointer`}
                      onClick={() => {
                        if (notif.isRead) return;
                        handleNotificationClick(notif.id);
                      }}
                    >
                      <div>{notif.message}</div>
                      <div className="opacity-50 text-xs">
                        {FormatDateTime(notif.createdAt, "dd/mm/yyyy")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                "No notifications"
              )}
            </div>
          </div>
        </div>
        {isAuthenticated && user.type === "candidate" ? (
          <Link
            to="/"
            onClick={handleLogout}
            className="hover:border-b-2 hover:border-b-white h-full p-2"
          >
            Log out
          </Link>
        ) : (
          <Link
            to="/signin/candidates"
            className="hover:border-b-2 hover:border-b-white h-full p-2"
          >
            Log in
          </Link>
        )}
      </div>
    </div>
  );
};
