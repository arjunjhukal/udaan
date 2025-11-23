import { Box } from '@mui/material'
import React from 'react'
import { LiveClassTabs, type LiveClassPayload, type liveClassTabType } from '../../../../../types/liveClass'
import TabController from '../../../../molecules/TabController'
import LiveClassCard from '../../../../organism/Cards/LiveClassCard'

export default function LiveClassGrid({ liveClasses }: { liveClasses: LiveClassPayload[] }) {
    const [activeTab, setActiveTab] = React.useState<liveClassTabType>("live_class");
    return (
        <Box>
            <TabController
                options={LiveClassTabs}
                currentActive={activeTab}
                setActiveTab={setActiveTab}

            />
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4">
                {liveClasses.length && liveClasses.map((liveClass) => (
                    <div className="col-span-1" key={liveClass.id}>
                        <LiveClassCard liveClass={liveClass} />
                    </div>
                ))}
            </div>
        </Box>
    )
}
