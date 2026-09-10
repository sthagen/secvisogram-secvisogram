import React from 'react'
import { Checkbox } from '@mui/material'
import DocumentEditorContext from '../../../../shared/DocumentEditorContext.js'
import Attribute from './shared/Attribute.js'

/**
 * @typedef {object} Props
 * @property {boolean} [required]
 * @property {boolean} value
 * @property {boolean} disabled
 */

/** @typedef {import('react').ComponentProps<typeof Attribute>} AttributeProps */

/**
 * @param {Props & AttributeProps} props
 */
export default function CheckboxAttribute({
  required = false,
  value,
  disabled,
  ...props
}) {
  const { updateDoc } = React.useContext(DocumentEditorContext)
  return (
    <Attribute disabled={disabled} {...props}>
      <Checkbox
        sx={{
          // Unchecked color
          color: '#000000',
          '&.Mui-checked': {
            color: '#000000',
          },
        }}
        checked={value}
        required={required}
        onChange={() => {
          updateDoc(props.instancePath, !value)
        }}
        disabled={disabled}
      />
    </Attribute>
  )
}
