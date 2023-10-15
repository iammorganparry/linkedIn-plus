import { CenterSpinner } from "@/components/ui/center-spinner";
import { useSignIn } from "@clerk/clerk-react";
import { UserAuthForm } from "@/components/forms/login";
import { useState } from "react";
import Logo from "@/assets/logo.svg";
export const LoginPage = () => {
  const [{ email, password }, setLoginState] = useState({
    email: "",
    password: "",
  });

  const { isLoaded, signIn, setActive } = useSignIn();

  const handleLogin = async () => {
    try {
      const url = await signIn?.create({
        identifier: email,
        password: password,
      });

      if (url?.status === "complete") {
        setActive?.({ session: url.createdSessionId });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!isLoaded) {
    return <CenterSpinner />;
  }

  return (
    <div className="flex flex-col h-[100vh] w-[100vw] justify-center align-center p-10">
      <div className="flex align-center justify-center mb-10">
        <img src={Logo} className="w-20 h-20" />
      </div>
      <UserAuthForm
        email={email}
        password={password}
        onSignIn={handleLogin}
        onEmailChange={(email) => setLoginState((ps) => ({ ...ps, email }))}
        onPasswordChange={(password) =>
          setLoginState((ps) => ({ ...ps, password }))
        }
      />
    </div>
  );
};
