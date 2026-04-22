import { useEffect, useState } from 'react';
import { useMarkTransactionSeenMutation } from '../../../../services/menuApi';
import AllTransaction from './AllTransaction';

export default function AllTransactionRoot() {
    const [open, setOpen] = useState(false);
    const [markSeen] = useMarkTransactionSeenMutation();

    useEffect(() => { markSeen(); }, []);

    return <AllTransaction open={open} setOpen={setOpen} />;
}
