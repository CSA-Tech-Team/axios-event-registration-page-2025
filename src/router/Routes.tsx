import { ERouterPaths } from "@/constants/enum";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute, { LoginProtectedRoute } from "./ProtectedRoutes";
import SignIn from "@/pages/SignInPage";
import SignUp from "@/pages/SignUpPage";
import { EventsPage } from "@/pages/EventsPage";
import { EventDetailsPage } from "@/pages/EventDetailsPage";
import Notfound from "@/pages/404NotFound";
import Accommodation from "@/pages/Accommodation";
import Invitation from "@/pages/Invitation";
import LandingPage from "@/pages/LandingPage";
import Teams from "@/pages/Teams";
import ProfileLayout from "@/components/common/ProfileOutlet";
import Profile from "@/pages/Profile";
import { Leaderboard } from "@/pages/Leaderboard";
const AxiosRoutes = () => {
  return (
    <Routes>
      <Route
        path={ERouterPaths.SIGNIN}
        element={
          <LoginProtectedRoute>
            <SignIn />
          </LoginProtectedRoute>
        }
      />
      <Route
        path={ERouterPaths.SIGNUP}
        element={
          <LoginProtectedRoute>
            <SignUp />
          </LoginProtectedRoute>
        }
      />
      <Route element={<ProfileLayout />}>
        <Route path={ERouterPaths.HOME} element={<LandingPage />} />
        <Route path={ERouterPaths.EVENTS} element={<EventsPage />} />
        <Route
          path={`${ERouterPaths.EVENTS}/:id`}
          element={<EventDetailsPage />}
        />

        <Route
          path={ERouterPaths.TEAMS}
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />
        <Route
          path={ERouterPaths.ACCOMODATION}
          element={
            <ProtectedRoute>
              <Accommodation />
            </ProtectedRoute>
          }
        />
        <Route
          path={ERouterPaths.INVITATION}
          element={
            <ProtectedRoute>
              <Invitation />
            </ProtectedRoute>
          }
        />
        <Route
          path={ERouterPaths.PROFILE}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path={ERouterPaths.LEADERBOARD} element={<Leaderboard />} />
      </Route>
      <Route path={ERouterPaths.NOT_FOUND} element={<Notfound />} />
    </Routes>
  );
};

export default AxiosRoutes;
