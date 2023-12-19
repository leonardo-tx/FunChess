import { useAtom } from "jotai";
import accountAtom from "@/data/auth/atoms/accountAtom";
import CurrentAccount from "../../../core/auth/models/CurrentAccount";
import { loginAccount, logoutAccount, registerAccount, deleteAccount, updateAccount } from "@/data/auth/fetchers/auth-fetchers";
import LoginForm from "../../../core/auth/forms/LoginForm";
import RegisterForm from "../../../core/auth/forms/RegisterForm";
import { getCurrentAccount } from "../fetchers/account-fetchers";
import { StatusCodes } from "http-status-codes";
import UpdateForm from "@/core/auth/forms/UpdateForm";

export default function useAuth(): { 
    currentAccount: CurrentAccount | null, 
    authenticated: boolean, 
    logout: () => void,
    login: (form: LoginForm) => Promise<StatusCodes>
    register: (form: RegisterForm) => Promise<StatusCodes>
    deleteAccount: (form: UpdateForm) => Promise<StatusCodes>,
    update: (form: UpdateForm) => Promise<StatusCodes>,
} {
    const [currentAccount, setCurrentAccount] = useAtom(accountAtom);
    const authenticated = currentAccount !== null;

    const logout = (): void => {
        if (!authenticated) return;
        logoutAccount().then((data) => {
            if (data.status === StatusCodes.OK) setCurrentAccount(null);
        });
    }

    const login = async (form: LoginForm): Promise<StatusCodes> => {
        if (authenticated) return StatusCodes.UNAUTHORIZED;
        
        const loginResponse = await loginAccount(form);
        if (loginResponse.status !== StatusCodes.OK) return loginResponse.status;
        
        const currentAccountResponse = await getCurrentAccount();
        if (currentAccountResponse.status === StatusCodes.OK) {
            setCurrentAccount(currentAccountResponse.result!);
        } else {
            setCurrentAccount(null);
        }
        return currentAccountResponse.status;
    }

    const register = async (form: RegisterForm): Promise<number> => {
        if (authenticated) return -1;

        return (await registerAccount(form)).status;
    }

    const deleteFunction = async (form: UpdateForm): Promise<StatusCodes> => {
        delete form.email;
        delete form.password;
        delete form.username;

        const response = (await deleteAccount(form)).status;
        
        if (response === StatusCodes.OK) setCurrentAccount(null);
        return response;
    }

    const update = async (form: UpdateForm): Promise<StatusCodes> => {
        if (form.email === "") form.email = null;
        if (form.password === "") form.password = null;
        if (form.username === "") form.username = null;
        
        const response = (await updateAccount(form)).status;
        if (response !== StatusCodes.OK) return response;

        const currentAccountResponse = await getCurrentAccount();
        if (currentAccountResponse.status === StatusCodes.OK) {
            setCurrentAccount(currentAccountResponse.result!);
        } else {
            setCurrentAccount(null);
        }
        return currentAccountResponse.status;
    }

    return { currentAccount, authenticated, logout, login, register, deleteAccount: deleteFunction, update };
}