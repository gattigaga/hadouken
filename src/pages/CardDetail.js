import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import chroma from "chroma-js";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";

import Header from "../components/card-detail/Header";
import Description from "../components/card-detail/Description";
import CheckList from "../components/card-detail/CheckList";
import {
  updateCard,
  createCheck,
  updateCheck,
  deleteCheck,
  deleteChecks,
  deleteCard,
  moveCheck,
} from "../store/actionCreators";

const Container = styled.div`
  width: 100%;
  max-height: calc(100vh - 48px);
  padding: 24px;
  background: #eee;
  border-radius: 4px;
  box-sizing: border-box;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 8px;
    background: #eee;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: ${chroma("#eee").darken(0.5).hex()};
  }
`;

const modalStyles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.7)",
  },
  content: {
    background: "none",
    border: 0,
    borderRadius: 0,
    width: "calc(100% - 48px)",
    maxWidth: 640,
    padding: 0,
    margin: "auto",
    left: 24,
    right: 24,
    top: 24,
    bottom: 24,
  },
};

const machine = Machine({
  id: "cardDetail",
  initial: "idle",
  states: {
    idle: {
      on: {
        UPDATE_CARD_NAME: "updateCardName",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: "updateCheck",
      },
    },
    updateCardName: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: "updateCheck",
      },
    },
    updateCardDescription: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_NAME: "updateCardName",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: "updateCheck",
      },
    },
    createCheck: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_NAME: "updateCardName",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        UPDATE_CHECK: "updateCheck",
      },
    },
    updateCheck: {
      on: {
        IDLE: "idle",
        UPDATE_CARD_NAME: "updateCardName",
        UPDATE_CARD_DESCRIPTION: "updateCardDescription",
        CREATE_CHECK: "createCheck",
        UPDATE_CHECK: "updateCheck",
      },
    },
  },
});

const CardDetail = () => {
  const [current, send] = useMachine(machine);
  const { cardSlug } = useParams();

  // Get current card
  const card = useSelector((state) =>
    state.cards.find((card) => card.slug === cardSlug)
  );

  // Get group that contains current card
  const group = useSelector((state) =>
    state.groups.find((group) => group.id === card.groupId)
  );

  // Get current card's checks
  const checks = useSelector((state) =>
    state.checks.filter((check) => check.cardId === card.id)
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const refInputName = useRef(null);
  const refInputDescription = useRef(null);
  const refInputCheck = useRef(null);

  const totalChecked = checks.filter((check) => !!check.isChecked).length;
  const divide = totalChecked / checks.length;
  const progress = Number.isNaN(divide) ? 0 : (divide * 100).toFixed(0);
  const isUpdateCardName = current.matches("updateCardName");
  const isUpdateCardDescription = current.matches("updateCardDescription");
  const isCreateCheck = current.matches("createCheck");

  useEffect(() => {
    if (isUpdateCardName) {
      refInputName.current.select();
    }
  }, [isUpdateCardName]);

  useEffect(() => {
    if (isUpdateCardDescription) {
      refInputDescription.current.select();
    }
  }, [isUpdateCardDescription]);

  useEffect(() => {
    if (isCreateCheck) {
      refInputCheck.current.focus();
    }
  }, [isCreateCheck]);

  const updateCheckOrder = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const isSameCard = destination.droppableId === source.droppableId;
    const isSameIndex = destination.index === source.index;

    if (isSameCard && isSameIndex) return;

    dispatch(
      moveCheck(draggableId, {
        index: destination.index,
      })
    );
  };

  const updateCardName = (name) => {
    dispatch(updateCard(card.id, { name }));
    send("IDLE");
  };

  const updateCardDescription = (description) => {
    dispatch(updateCard(card.id, { description }));
    send("IDLE");
  };

  const addNewCheck = (label) => {
    dispatch(createCheck({ cardId: card.id, label }));
  };

  const toggleCheck = (item) => {
    dispatch(
      updateCheck(item.id, {
        isChecked: !item.isChecked,
      })
    );
  };

  const updateCheckLabel = (item, label) => {
    dispatch(updateCheck(item.id, { label }));
    send("IDLE");
  };

  const removeCheck = (item) => {
    dispatch(deleteCheck(item.id));
  };

  const removeCard = () => {
    history.goBack();

    setTimeout(() => {
      const checkIds = checks.map((check) => check.id);

      dispatch(deleteChecks(checkIds));
      dispatch(deleteCard(card.id));
    }, 50);
  };

  if (!card || !group) return null;

  return (
    <Modal
      style={modalStyles}
      onRequestClose={() => {
        send("IDLE");

        if (current.matches("idle")) {
          history.goBack();
        }
      }}
      contentLabel="Card Detail"
      isOpen
    >
      <Container onClick={() => send("IDLE")}>
        <Header
          refInput={refInputName}
          title={card.name}
          groupName={group.name}
          isEdit={current.matches("updateCardName")}
          onApplyTitle={updateCardName}
          onClickClose={() => {
            send("IDLE");
            history.goBack();
          }}
          onClickTitle={() => send("UPDATE_CARD_NAME")}
          onClickDelete={removeCard}
        />
        <Description
          refInput={refInputDescription}
          value={card.description}
          isEdit={current.matches("updateCardDescription")}
          onClick={() => send("UPDATE_CARD_DESCRIPTION")}
          onClickCancel={() => send("IDLE")}
          onClickApply={updateCardDescription}
        />
        <CheckList
          refInput={refInputCheck}
          card={card}
          items={checks}
          progress={progress}
          isCreate={current.matches("createCheck")}
          isEdit={current.matches("updateCheck")}
          onDragEnd={updateCheckOrder}
          onClickAdd={() => send("CREATE_CHECK")}
          onClickCancelAdd={() => send("IDLE")}
          onClickApplyAdd={addNewCheck}
          onClickCheckItem={toggleCheck}
          onClickLabelItem={() => send("UPDATE_CHECK")}
          onClickApplyUpdateItem={updateCheckLabel}
          onClickCancelUpdateItem={() => send("IDLE")}
          onClickDeleteItem={removeCheck}
        />
      </Container>
    </Modal>
  );
};

export default CardDetail;
