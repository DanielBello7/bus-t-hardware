import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components';
import { Loader } from 'lucide-react';
import { toaster, useSettings } from '@/store';
import { useCallback, useEffect, useState } from 'react';
import { ensure_error } from '@/lib/ensure-error';
import { LOG } from '@/types/log';
import { get_logs } from '@/api';

export function Logs() {
    const [logs, setLogs] = useState<LOG[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const settings = useSettings((state) => state);

    const get_data = useCallback(async () => {
        if (!settings.data.connected) {
            return setIsLoading(false);
        }
        setIsLoading(true);

        try {
            const response = await get_logs();
            console.log('response', response);
            setLogs([]);
        } catch (e) {
            const err = ensure_error(e);
            toaster.error(
                `Error occured when fetching logs: ${err.message}`
            );
        } finally {
            setIsLoading(false);
        }
    }, [settings.data.connected]);

    useEffect(() => {
        get_data();
    }, [get_data]);

    return (
        <div className="w-full h-full p-3">
            {isLoading && (
                <div className="flex justify-center">
                    <Loader className="size-4" />
                    <br />
                </div>
            )}

            <Table className="border rounded-sm">
                {logs.length < 1 && (
                    <TableCaption className="text-black">
                        No logs to show
                    </TableCaption>
                )}
                <TableCaption>
                    A list of your recent activity logs.
                </TableCaption>
                <TableHeader className="bg-muted text-md">
                    <TableRow>
                        <TableHead className="w-[100px]">S/N</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Performed At</TableHead>
                        <TableHead>Light On</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-md w-full">
                    {logs.map((datum, idx) => (
                        <TableRow key={idx}>
                            <TableCell className="font-medium">
                                {idx + 1}
                            </TableCell>
                            <TableCell>
                                {new Date(
                                    datum.created_at
                                ).toLocaleDateString('en-us', {
                                    dateStyle: 'short',
                                })}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate line-clamp-5">
                                <span className="truncate">
                                    {datum.value.action}
                                </span>
                            </TableCell>
                            <TableCell className="truncate">
                                {new Date(
                                    datum.value.performed_at
                                ).toLocaleDateString('en-us', {
                                    dateStyle: 'short',
                                })}
                            </TableCell>
                            <TableCell>
                                {datum.value.status ? 'True' : 'False'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
