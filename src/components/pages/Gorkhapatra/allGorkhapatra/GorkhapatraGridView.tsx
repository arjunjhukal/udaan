import type { GorkhapatraProps } from '../../../../types/gorkhapatra'
import GorkhapatraCard from '../../../organism/Cards/GorkhapatraCard'

export default function GorkhapatraGridView({ data }: { data: GorkhapatraProps[] }) {
    return (
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {data.map((gorkhapatra) => (
                <GorkhapatraCard data={gorkhapatra} key={gorkhapatra.title + gorkhapatra.id} />
            ))}
        </div>
    )
}
