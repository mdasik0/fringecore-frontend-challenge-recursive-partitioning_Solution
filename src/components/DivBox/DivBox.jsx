import React from 'react'

export default function DivBox() {
  return (
     <div ref={containerRef} className="flex flex-col w-full h-full">
        {children[0] && (
          <div
            style={{ height: children.length === 1 ? "100%" : `${topHeight}%` }}
            className="w-full"
          >
            <DivBox
              key={children[0].id}
              id={children[0].id}
              depth={depth + 2}
              bgColor={children[0].color}
              onDelete={
                children.length === 2
                  ? () => handleSplit_Delete(children[0].id)
                  : onDelete
              }
            />
          </div>
        )}
        {children.length === 2 && (
          <ResizeComponent_H
            onResize={handleResize_Horizontally}
            onResizeEnd={handleResizeEnd_Horizontally}
            currentPercentage={topHeight}
          />
        )}
        {children[1] && (
          <div
            style={{
              height: children.length === 1 ? "100%" : `${100 - topHeight}%`,
            }}
            className="w-full"
          >
            <DivBox
              key={children[1].id}
              id={children[1].id}
              depth={depth + 2}
              bgColor={children[1].color}
              onDelete={
                children.length === 2
                  ? () => handleSplit_Delete(children[1].id)
                  : onDelete
              }
            />
          </div>
        )}
      </div>
  )
}
