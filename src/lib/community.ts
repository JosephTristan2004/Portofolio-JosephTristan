import { z } from "zod";
export const rooms = ["lobby", "data-code", "showcase"] as const;
export const messageSchema = z.object({
    id: z.string().uuid(),
    room: z.enum(rooms),
    name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(32, "Nama maksimal 32 karakter."),
    body: z.string().trim().min(1, "Tulis pesan terlebih dahulu.").max(1000, "Pesan maksimal 1.000 karakter."),
    link: z.string().trim().max(500).refine(value => { if (!value)
        return true; try {
        const u = new URL(value);
        return ["https:", "http:"].includes(u.protocol) && !u.username && !u.password;
    }
    catch {
        return false;
    } }, "Gunakan tautan http:// atau https:// yang valid.").default(""),
});
export type CommunityMessage = {
    id: string;
    room: string;
    name: string;
    body: string;
    link: string;
    created_at: number;
};
