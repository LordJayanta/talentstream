import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'


export default function JobDetailsBody() {
    return (
        <section>
            <Card>
                <CardHeader>
                    <CardTitle className='text-base font-semibold'>Job Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-zinc-600 text-base'>
                        We are looking for a Senior Product Designer to lead the experience design for our core enterprise
                        platform. You will sit at the intersection of product strategy and user-centered execution, turning
                        complex data workflows into intuitive, beautiful interfaces.
                    </p>
                </CardContent>
            </Card>
        </section>
    )
}
