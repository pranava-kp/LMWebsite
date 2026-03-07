import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPassword from "./ForgotPassword";

function Template({ title, description1, description2, image, formType }) {
  const loading = false; // TO DELETE

  let FormComponent;
  switch (formType) {
    case "signup":
      FormComponent = SignupForm;
      break;
    case "forgotPassword":
      FormComponent = ForgotPassword;
      break;
    default:
      FormComponent = LoginForm;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="w-full max-w-[450px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white leading-tight">
              {title}
            </h1>
            <p className="mt-3 text-slate-300">
              <span className="block italic text-blue-400">{description1}</span>
              <span className="text-sm">{description2}</span>
            </p>
          </header>
          <FormComponent />
        </div>
      )}
    </div>
  );
}

export default Template;