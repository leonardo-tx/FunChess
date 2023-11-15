export default interface Account {
    id: number;
    username: string;
    creation: Date;
    image: Blob | undefined;
}