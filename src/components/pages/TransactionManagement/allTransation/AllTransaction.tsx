import TableFilter from '../../../organism/TableFilter'

export default function AllTransaction() {
    return (
        <>
            <TableFilter
                search=''
                setSearch={() => { }}
                selectedRows={new Set<number|string>()}
                handleRoleDelete={()=>{}}
            />
        </>
    )
}
