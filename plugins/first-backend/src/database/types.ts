export type RandomUserRow = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    avatar?: string;
    nat?: string;
    gender: "male" | "female";
}