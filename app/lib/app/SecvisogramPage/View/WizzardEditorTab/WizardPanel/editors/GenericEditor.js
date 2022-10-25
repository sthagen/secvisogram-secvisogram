import React from 'react'
import DocumentEditorContext from '../../../shared/DocumentEditorContext.js'
import ArrayEditor from './GenericEditor/ArrayEditor.js'
import ObjectEditor from './GenericEditor/ObjectEditor.js'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

/**
 * @param {object} props
 * @param {import('../shared/types').Property | null} props.parentProperty
 * @param {import('../shared/types').Property} props.property
 * @param {string[]} props.instancePath
 */
export default function Editor({ parentProperty, property, instancePath }) {
  const { doc, errors, updateDoc } = React.useContext(DocumentEditorContext)

  const fieldErrors = errors.filter(
    (e) => e.instancePath === '/' + instancePath.join('/')
  )

  if (property.type === 'ARRAY') {
    return <ArrayEditor property={property} instancePath={instancePath} />
  } else if (property.type === 'OBJECT') {
    return (
      <ObjectEditor
        parentProperty={parentProperty}
        property={property}
        instancePath={instancePath}
      />
    )
  } else if (property.type === 'STRING') {
    const value = instancePath.reduce((value, pathSegment) => {
      return (value ?? {})[pathSegment]
    }, /** @type {Record<string, any> | null} */ (doc))
    const sanitizedValue = typeof value === 'string' ? value : ''

    return (
      <div className="bg-white">
        <div className="flex m-1">
          <div className="grid place-items-center px-2">
            <FontAwesomeIcon
              icon={faCircle}
              color={fieldErrors.length === 0 ? "green" : "red"}
              className="text-xs"
            />
          </div>
          <label className="block">{property.title}</label>
          <button
            type="button"
            className="w-9 flex-none"
            onClick={() => {}}
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
              className=""
              size="xs"
            />
          </button>
        </div>
        <input
          className="border px-2 py-1"
          type="text"
          value={sanitizedValue}
          onChange={(e) => {
            updateDoc(instancePath, e.target.value)
          }}
        />
        <div className="m-1">
          <ul className="block list-disc list-inside">
            {fieldErrors.map((e, i) => (
              <li key={`${i}-${e.message}`}>{e.message}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  } else {
    return (
      <div className="bg-white">
        <div>{property.fullName.join('.')}</div>
        <div>{}</div>
      </div>
    )
  }
}
