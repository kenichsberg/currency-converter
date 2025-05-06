'use client'
import { JSX } from 'react'
import {
  Button,
  ComboBox as Combo,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from 'react-aria-components'

type Props<T extends string & number & undefined> = {
  schema: any
  value: T
}

export default function ComboBox<T extends string & number & undefined>(
  props: /*Props<T>*/ any,
): JSX.Element {
  const { list, label, isDisabled, defaultInputValue, onInputChange, ...inputProps } = props
  return (
    <>
      <Combo
        defaultInputValue={defaultInputValue}
        isDisabled={isDisabled}
        onInputChange={onInputChange}
      >
        <Label>{label}</Label>
        <div>
          <Input {...inputProps} />
          <Button>▼</Button>
        </div>
        <Popover>
          <ListBox>
            {list?.map((item: string, index: number) => (
              <ListBoxItem key={index}>{item}</ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Combo>
    </>
  )
}
