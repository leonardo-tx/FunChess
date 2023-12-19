export default interface UpdateForm {
    email?: string | null;
    username?: string | null;
    currentPassword: string;
    password?: string | null;
}