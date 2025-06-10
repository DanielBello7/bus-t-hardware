import { Actions, Logs, Settings } from '@/features';
import { TabsContent } from '@/components';
import { Header } from '@/components/header';

export function Container() {
    const data = [
        { id: 'actions', content: <Actions /> },
        { id: 'logs', content: <Logs /> },
        { id: 'settings', content: <Settings /> },
    ];
    return (
        <div className="w-full flex flex-col grow">
            <Header />
            <div className="flex grow flex-col overflow-scroll">
                {data.map((i, idx) => (
                    <TabsContent value={i.id} key={idx}>
                        {i.content}
                    </TabsContent>
                ))}
            </div>
        </div>
    );
}
