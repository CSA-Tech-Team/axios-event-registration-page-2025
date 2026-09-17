import SignIn from "./SignInPage";

/**
 * With Google there is no separate registration step - the first sign-in
 * creates the account. /signup therefore renders the same page as /signin
 * rather than a different flow that would only be able to do the same thing.
 *
 * The route is kept because the landing page links to it directly
 * (app.axios.psgtech.ac.in/signup, including the alumni referral link).
 */
const SignUp = () => <SignIn />;

export default SignUp;
