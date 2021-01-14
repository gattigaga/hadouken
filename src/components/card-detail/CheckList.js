import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";

import Button from "../common/Button";
import Section from "./Section";
import Progress from "./Progress";
import Check from "./Check";
import CreateCheckForm from "./CreateCheckForm";

const AddCheckButton = styled(Button)`
  margin-top: 8px;
  margin-left: 32px;
`;

const CheckList = ({
  refInput,
  card,
  items,
  progress,
  isCreate,
  isEdit,
  onDragEnd,
  onClickAdd,
  onClickCancelAdd,
  onClickApplyAdd,
  onClickCheckItem,
  onClickLabelItem,
  onClickApplyUpdateItem,
  onClickCancelUpdateItem,
  onClickDeleteItem,
}) => {
  const [itemId, setItemId] = useState(null);

  return (
    <Section icon={faCheckSquare} title="Checklist">
      <Progress value={progress} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={card.id} direction="vertical" type="CHECK">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item) => (
                <Check
                  key={item.id}
                  id={item.id}
                  index={item.index}
                  label={item.label}
                  isChecked={item.isChecked}
                  onClickCheck={() => onClickCheckItem(item)}
                  onClickLabel={() => {
                    setItemId(item.id);
                    onClickLabelItem(item);
                  }}
                  onClickApplyUpdate={(newLabel) => {
                    onClickApplyUpdateItem(item, newLabel);
                  }}
                  onClickCancelUpdate={onClickCancelUpdateItem}
                  onClickDelete={() => onClickDeleteItem(item)}
                  isWillUpdateLabel={isEdit && itemId === item.id}
                />
              ))}
              {provided.placeholder}
              {isCreate ? (
                <CreateCheckForm
                  refInput={refInput}
                  onClickApply={onClickApplyAdd}
                  onClickCancel={onClickCancelAdd}
                />
              ) : (
                <AddCheckButton
                  label="Add an item"
                  color="#34495e"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClickAdd();
                  }}
                />
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Section>
  );
};

CheckList.propTypes = {
  refInput: PropTypes.any,
  value: PropTypes.string,
  isEdit: PropTypes.bool,
  onClick: PropTypes.func,
  onCancel: PropTypes.func,
  onClickApply: PropTypes.any,
};

export default CheckList;
