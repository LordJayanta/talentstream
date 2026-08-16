'use client'

import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    CreateLink,
    headingsPlugin,
    InsertThematicBreak,
    listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    quotePlugin,
    Separator,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo,
    type MDXEditorMethods,
    type MDXEditorProps
} from '@mdxeditor/editor'
import React, { type ForwardedRef } from 'react'
import "@mdxeditor/editor/style.css"


type Props = {
    editorRef: ForwardedRef<MDXEditorMethods> | null;
} & MDXEditorProps;


export default function EditorClient({ editorRef, ...props }: Props) {
    return (
        <MDXEditor
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <UndoRedo />
                            <Separator />
                            <BoldItalicUnderlineToggles />
                            <ListsToggle />
                            <Separator />
                            <BlockTypeSelect />
                            <CreateLink />
                            <InsertThematicBreak/>
                            <Separator />
                        </>
                    )
                })
            ]}
            {...props}
            ref={editorRef}
        />
    )
}

