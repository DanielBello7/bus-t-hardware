import { Actions, Logs, Settings } from '@/features';
import { TabsContent } from '@/components';
import { Header } from '@/components/header';

export function Container() {
    return (
        <div className="w-full flex flex-col grow">
            <Header />
            <div className="flex grow flex-col overflow-scroll">
                <TabsContent value="actions">
                    <Actions />
                </TabsContent>
                <TabsContent value="logs">
                    <Logs />
                </TabsContent>
                <TabsContent value="settings">
                    <Settings />
                </TabsContent>
            </div>
        </div>
    );
}
