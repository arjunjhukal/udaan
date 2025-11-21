import type { LiveClassPayload } from '../../../../../types/liveClass'
import LiveClassCard from '../../../../organism/Cards/LiveClassCard'

export default function LiveClassGrid({ liveClasses }: { liveClasses: LiveClassPayload[] }) {
    return (
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4">
            {liveClasses.length && liveClasses.map((liveClass) => (
                <div className="col-span-1" key={liveClass.id}>
                    <LiveClassCard liveClass={liveClass}/>
                </div>
            ))}
        </div>
    )
}
