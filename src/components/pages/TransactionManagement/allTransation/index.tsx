import { useState } from 'react';
import AllTransaction from './AllTransaction';

export default function AllTransactionRoot() {
    const [open, setOpen] = useState(false);
    return (
        <AllTransaction open={open} setOpen={setOpen} />
    )
}
