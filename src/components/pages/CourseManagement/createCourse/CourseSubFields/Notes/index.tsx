import React from 'react';
import EmptyRoute from '../../../../../organism/EmptyRoute';
import PageHeader from '../../../../../organism/PageHeader';

export default function CourseNotes() {
    const [open, setOpen] = React.useState(false);
    const handleNoteAddition = () => {
        setOpen((prev) => !prev);
    }
    return (
        <>
            <PageHeader
                breadcrumb={
                    [{
                        title: "Notes",
                    }]
                }
                description="Add notes for this course so that you can manage the note you wanted deeply. "
                cta={{
                    label: "Add Notes",
                    url: ""
                }}
                handleOpenPopup={handleNoteAddition}
            />
            <EmptyRoute
                title='No Notes found'
                message='Oops your notes is empty. Please add notes to help student gain knowlegde.'
                cta={{
                    label: "Add Notes",
                    url: ""
                }}
                variant="error"
                icon={(<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.3333 2.66699H10.6667C6 2.66699 4 5.33366 4 9.33366V22.667C4 26.667 6 29.3337 10.6667 29.3337H21.3333C26 29.3337 28 26.667 28 22.667V9.33366C28 5.33366 26 2.66699 21.3333 2.66699ZM10.6667 16.3337H16C16.5467 16.3337 17 16.787 17 17.3337C17 17.8803 16.5467 18.3337 16 18.3337H10.6667C10.12 18.3337 9.66667 17.8803 9.66667 17.3337C9.66667 16.787 10.12 16.3337 10.6667 16.3337ZM21.3333 23.667H10.6667C10.12 23.667 9.66667 23.2137 9.66667 22.667C9.66667 22.1203 10.12 21.667 10.6667 21.667H21.3333C21.88 21.667 22.3333 22.1203 22.3333 22.667C22.3333 23.2137 21.88 23.667 21.3333 23.667ZM24.6667 12.3337H22C19.9733 12.3337 18.3333 10.6937 18.3333 8.66699V6.00033C18.3333 5.45366 18.7867 5.00033 19.3333 5.00033C19.88 5.00033 20.3333 5.45366 20.3333 6.00033V8.66699C20.3333 9.58699 21.08 10.3337 22 10.3337H24.6667C25.2133 10.3337 25.6667 10.787 25.6667 11.3337C25.6667 11.8803 25.2133 12.3337 24.6667 12.3337Z" fill="#F97415" />
                </svg>)}
                handleClick={handleNoteAddition}
            />
        </>
    )
}
