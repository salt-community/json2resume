import { Button } from '@/components/ui/button'

interface ItemActionsProps {
  index: number
  totalItems: number
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  className?: string
}

export function ItemActions({
  index,
  totalItems,
  onMoveUp,
  onMoveDown,
  onRemove,
  className = '',
}: ItemActionsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Button
        onClick={onMoveUp}
        variant="outline"
        size="sm"
        className="h-7 px-2 text-xs flex-shrink-0"
        disabled={index === 0}
      >
        ↑
      </Button>
      <Button
        onClick={onMoveDown}
        variant="outline"
        size="sm"
        className="h-7 px-2 text-xs flex-shrink-0"
        disabled={index === totalItems - 1}
      >
        ↓
      </Button>
      <Button
        onClick={onRemove}
        variant="outline"
        size="sm"
        className="h-7 px-2 text-xs flex-shrink-0"
      >
        Remove
      </Button>
    </div>
  )
}
