import React from 'react'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '../ui/card'

interface Props {
    title: string;
    icon: React.ReactNode;
    children?: React.ReactNode;
    action?: React.ReactNode;
}

export default function JobInputCard({ children, icon, title, action }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-primary flex gap-2 items-center'>
                    <div> {icon} </div>
                    <h2 className='text-lg font-semibold'>{title}</h2>
                </CardTitle>
                {action && <CardAction>{action}</CardAction>}
            </CardHeader>

            <CardContent>{children}</CardContent>
        </Card>
    )
}
