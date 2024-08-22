import Image from 'next/image';
import { StaffHeading } from './heading';

type User = {
    username: string;
    prefix: string;
    sorting?: number;
};

type ResponseType = {
    [role: string]: User[];
};

async function getStaffMembers() {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/staff`;

    const res = await fetch(URL, {
        next: {
            revalidate: 60 * 10
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json() as Promise<ResponseType>;
}

export default async function Page() {
    const staffMembers = await getStaffMembers();

    return (
        <div className="flex-col rounded-[10px] bg-card p-6">
            <StaffHeading />

            <div className="grid gap-4">
                {Object.entries(staffMembers).map(([role, users]) => (
                    <StaffCategory key={role} role={role} users={users!} />
                ))}
            </div>
        </div>
    );
}

function StaffCategory({ role, users }: { role: string; users: User[] }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-accent-foreground">{role}</h2>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {users.map((user) => (
                    <StaffMember
                        key={user.username}
                        username={user.username}
                        prefix={user.prefix}
                    />
                ))}
            </div>
        </div>
    );
}

function StaffMember({ username, prefix }: User) {
    return (
        <div className="flex items-center gap-4 rounded-md border border-accent-foreground/10 bg-accent p-4">
            <Image
                src={`https://minotar.net/avatar/${username}/64`}
                alt={username}
                width={60}
                height={60}
                className="rounded-md"
            />
            <div>
                <h3 className="font-bold text-accent-foreground">{username}</h3>
                <p
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                        __html: prefix
                    }}
                ></p>
            </div>
        </div>
    );
}
