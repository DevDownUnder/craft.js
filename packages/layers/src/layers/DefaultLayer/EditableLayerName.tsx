import React, { useState, useRef, useEffect, useCallback } from "react";
import ContentEditable from "react-contenteditable";
import { useEditor } from "@craftjs/core";
import { useLayer } from "../useLayer";

export const EditableLayerName = () => {
  const { id } = useLayer();

  const { displayName, actions } = useEditor(state => ({
    displayName:
      state.nodes[id] && state.nodes[id].data.custom.displayName
        ? state.nodes[id].data.custom.displayName
        : state.nodes[id].data.displayName,
    hidden: state.nodes[id] && state.nodes[id].data.hidden
  }));

  const [editingName, setEditingName] = useState(false);
  const [internalDisplayName, setInternalDisplayName] = useState<string>(
    displayName
  );
  const nameDOM = useRef<HTMLElement | null>(null);

  const clickOutside = useCallback(e => {
    if (nameDOM.current && !nameDOM.current.contains(e.target)) {
      setEditingName(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("click", clickOutside);
    };
  }, [clickOutside]);

  useEffect(() => {
    if (internalDisplayName !== "")
      actions.setCustom(
        id,
        custom => (custom.displayName = internalDisplayName)
      );
  }, [actions, id, internalDisplayName]);

  useEffect(() => {
    if (!editingName && internalDisplayName === "")
      setInternalDisplayName(displayName);
  }, [displayName, editingName, internalDisplayName]);

  return (
    <ContentEditable
      html={internalDisplayName} // innerHTML of the editable div
      disabled={!editingName}
      ref={(ref: any) => {
        if (ref) {
          nameDOM.current = ref.el.current;
          window.removeEventListener("click", clickOutside);
          window.addEventListener("click", clickOutside);
        }
      }}
      onChange={e => {
        setInternalDisplayName(e.target.value);
      }} // use true to disable editing
      tagName="h2" // Use a custom HTML tag (uses a div by default)
      onDoubleClick={() => {
        if (!editingName) setEditingName(true);
      }}
    />
  );
};
