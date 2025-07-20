"use client";

import React, { useState, useEffect } from "react";
import { ButtonDemo, DialogDemo, InputDemo, DropdownMenuCheckboxes } from "@/components/index";
import localData from "@/localData";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Settings, Pencil, Expand } from "lucide-react";
import { useApiContext } from "@/contexts/ApiContext";
import { useAuthContext } from "@/contexts/AuthContext";
import useUtil from "@/hooks/useUtil";

type StateProps = {
  inGameID: string;
  country: string;
  languages: string;
  faction: string;
  mainUnitType: string;
  unitLevel: string;
  power: string;
  gameTime: any;
};

const UserInfoDialog = () => {
  return (
    <DialogDemo
      contentClassName="sm:max-w-[600px]"
      title="User information"
      description="Manage your personal data."
      trigger={
        <ButtonDemo startIcon={<Pencil />} className="rounded-full w-[35px] h-[35px]" variant="ghost" />
      }
    >
      {(closeDialog) => <UserInfoDialogContent closeDialog={closeDialog} />}
    </DialogDemo>
  );
};

const UserInfoDialogContent = ({ closeDialog = () => {} }) => {
  const [state, setState] = useState<StateProps>({
    inGameID: "",
    country: "",
    languages: "",
    faction: "",
    mainUnitType: "",
    unitLevel: "",
    power: "",
    gameTime: [],
  });



  const [isLoading, setIsLoading] = useState(false);
  const { fetchedPages, fetchedCurrentUser, updateUser, getUser } = useApiContext();
  const { currentUser } = useAuthContext();
  const { details } = fetchedCurrentUser;

  const { formatWithCommas, unformatFromCommas } = useUtil();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const raw = unformatFromCommas(value);
    if (!/^\d*$/.test(raw)) return; // prevent non-numeric
    setState((prev) => ({
      ...prev,
      [name]: formatWithCommas(raw),
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFields: { [key: string]: any } = {};

    if (state.inGameID !== details.inGameID) {
      updatedFields.inGameID = state.inGameID;
    }
    if (state.country !== details.country) {
      updatedFields.country = state.country;
    }
    if (state.languages !== details.languages) {
      updatedFields.languages = state.languages;
    }
    if (state.faction !== details.faction) {
      updatedFields.faction = state.faction;
    }
    if (state.gameTime !== details.gameTime) {
      updatedFields.gameTime = state.gameTime;
    }
    if (state.mainUnitType !== details.mainUnitType) {
      updatedFields.mainUnitType = state.mainUnitType;
    }
    if (state.unitLevel !== details.unitLevel) {
      updatedFields.unitLevel = state.unitLevel;
    }
    console.log(state);
    if (Number(unformatFromCommas(state.power.toString())) !== details.power) {
      updatedFields.power = Number(unformatFromCommas(state.power));
    }

    updateUser({
      id: currentUser?.uid,
      updatedFields,
      setIsLoading,
      callback: () => {
        closeDialog();
        getUser({ id: currentUser?.uid });
      },
    });
  };

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      inGameName: details.displayName || "",
      inGameID: details.inGameID || "",
      country: details.country || "",
      languages: details.languages || "",
      faction: details.faction || "",
      gameTime: Array.isArray(details.gameTime) ? details.gameTime || [] : [],
      mainUnitType: details.mainUnitType || "",
      unitLevel: details.unitLevel || "",
      power: (details.power && formatWithCommas(details.power.toString())) || "",
    }));
  }, [fetchedCurrentUser]);

  return (
    <div>
      <br />
      <form action="" onSubmit={onSubmit} className="">
        <div className="wrapper grid grid-cols-1 sm:grid-cols-2 gap-x-7  mb-3 items-start">
          <InputDemo
            label="In-Game ID"
            placeholder="e.g., John Doe"
            name="inGameID"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-5"
            value={state.inGameID}
          />
          <InputDemo
            label="Country"
            placeholder="e.g., United States"
            name="country"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-5"
            value={state.country}
          />
          <InputDemo
            label="Languages"
            placeholder="e.g., English, Spanish"
            name="languages"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-5"
            value={state.languages}
          />

          <InputDemo
            label="Faction"
            placeholder="e.g., League of Order"
            name="faction"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-5"
            value={state.faction}
          />
          {/* <InputDemo
            label="Game Time"
            placeholder="e.g., 13:00 – 17:00 UTC"
            name="gameTime"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-5"
            value={state.gameTime}
          /> */}

          <InputDemo
            label="main Unit Type"
            placeholder="e.g., Archer"
            name="mainUnitType"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-5"
            value={state.mainUnitType}
          />
          <InputDemo
            label="unit Level"
            placeholder="e.g., T4"
            name="unitLevel"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-5"
            value={state.unitLevel}
          />
          <InputDemo
            label="Power"
            placeholder="e.g., 10,000,000"
            name="power"
            // type="number"
            type="text"
            callback={(e) => onNumberChange(e)}
            className="mb-5"
            value={state.power}
          />
          <DropdownMenuCheckboxes
            label="Game Time"
            // placeholder="Select Game Time"
            buttonName="Select Game Time"
            triggerClassName="w-full mb-5"
            contentClassName=""
            defaultItems={utcHourOptions.map((i) => {
              return {
                id: i.id,
                label: i.label,
                value: i.value,
                isChecked: state.gameTime.find((item: any) => item.id == i.id) ? true: false,
              };
            })}
            callback={(checkedItems:any) => {
              console.log(checkedItems);
              setState((prev) => ({
                ...prev,
                gameTime: checkedItems,
              }));
            }}
          />
        </div>

        <div className="button-group flex gap-2 justify-end">
          <ButtonDemo className="" text="Cancel" variant="outline" type="button" onClick={closeDialog} />
          <ButtonDemo className="" text={`${isLoading ? "Loading..." : "Save"}`} />
        </div>
      </form>
    </div>
  );
};

export default UserInfoDialog;

const utcHourOptions = [
  { id: "utc_00", value: "00", label: "00:00 UTC" },
  { id: "utc_01", value: "01", label: "01:00 UTC" },
  { id: "utc_02", value: "02", label: "02:00 UTC" },
  { id: "utc_03", value: "03", label: "03:00 UTC" },
  { id: "utc_04", value: "04", label: "04:00 UTC" },
  { id: "utc_05", value: "05", label: "05:00 UTC" },
  { id: "utc_06", value: "06", label: "06:00 UTC" },
  { id: "utc_07", value: "07", label: "07:00 UTC" },
  { id: "utc_08", value: "08", label: "08:00 UTC" },
  { id: "utc_09", value: "09", label: "09:00 UTC" },
  { id: "utc_10", value: "10", label: "10:00 UTC" },
  { id: "utc_11", value: "11", label: "11:00 UTC" },
  { id: "utc_12", value: "12", label: "12:00 UTC" },
  { id: "utc_13", value: "13", label: "13:00 UTC" },
  { id: "utc_14", value: "14", label: "14:00 UTC" },
  { id: "utc_15", value: "15", label: "15:00 UTC" },
  { id: "utc_16", value: "16", label: "16:00 UTC" },
  { id: "utc_17", value: "17", label: "17:00 UTC" },
  { id: "utc_18", value: "18", label: "18:00 UTC" },
  { id: "utc_19", value: "19", label: "19:00 UTC" },
  { id: "utc_20", value: "20", label: "20:00 UTC" },
  { id: "utc_21", value: "21", label: "21:00 UTC" },
  { id: "utc_22", value: "22", label: "22:00 UTC" },
  { id: "utc_23", value: "23", label: "23:00 UTC" },
];
