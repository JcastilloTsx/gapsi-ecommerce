import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const OPTIONS = ['Relevancia', 'Precio menor', 'Precio mayor']

// Único componente Material-UI de control: un Select temático, sin rehacer el resto del layout.
export default function SortMenu({ value, onChange }) {
  return (
    <Select
      size="small"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="sort-select"
      sx={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, borderRadius: '9px', background: '#fff' }}
    >
      {OPTIONS.map((option) => (
        <MenuItem key={option} value={option} sx={{ fontSize: 13 }}>{option}</MenuItem>
      ))}
    </Select>
  )
}
