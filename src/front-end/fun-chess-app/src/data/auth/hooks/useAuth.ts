import { useAtom } from "jotai";
import accountAtom from "@/data/auth/atoms/accountAtom";
import CurrentAccount from "../../../core/auth/models/CurrentAccount";
import { loginAccount, logoutAccount, registerAccount } from "@/data/auth/fetchers/auth-fetchers";
import LoginForm from "../../../core/auth/forms/LoginForm";
import RegisterForm from "../../../core/auth/forms/RegisterForm";
import { getCurrentAccount } from "../fetchers/account-fetchers";

export default function useAuth(): { 
    currentAccount: CurrentAccount | null, 
    authenticated: boolean, 
    logout: () => void,
    login: (form: LoginForm) => Promise<number>
    register: (form: RegisterForm) => Promise<number>
} {
    const [currentAccount, setCurrentAccount] = useAtom(accountAtom);
    const authenticated = currentAccount !== null;

    const logout = (): void => {
        if (!authenticated) return;
        logoutAccount().then((data) => {
            if (data.status === 200) setCurrentAccount(null);
        });
    }

    const login = async (form: LoginForm): Promise<number> => {
        if (authenticated) return -1;
        
        const loginResponse = await loginAccount(form);
        if (loginResponse.status !== 200) return loginResponse.status;
        
        const currentAccountResponse = await getCurrentAccount();
        if (currentAccountResponse.status === 200) {
            setCurrentAccount(currentAccountResponse.result!);
        }
        return currentAccountResponse.status;
    }

    const register = async (form: RegisterForm): Promise<number> => {
        if (authenticated) return -1;

        return (await registerAccount(form)).status;
    }

    return { currentAccount, authenticated, logout, login, register };
}