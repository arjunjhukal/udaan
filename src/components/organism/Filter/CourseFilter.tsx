import { Button, Checkbox, Dialog, DialogContent, Divider, FormControlLabel, OutlinedInput, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import SearchIcon from "../../../icons/SearchIcon";
import type { DeviceType, Status } from "../../../types";
import type { CategoryProps } from "../../../types/category";
import type { SelectionType } from "../../../types/course";
import type { positionProps } from "../../../types/position";
import type { RoleProps } from "../../../types/roleAndPermission";
import type { RegisterUserProps } from "../../../types/user";
import CategoryFilter from "../CategoryFilter";

interface Props {
  megaCategories?: CategoryProps[];
  categories?: CategoryProps[];
  subCategories?: CategoryProps[];
  positions?: positionProps[];
  selections: SelectionType;
  onChange: (
    type: "mega" | "category" | "sub" | "position" | "teacher" | "role",
    ids: number[],
    parentId?: number
  ) => void;
  loadingMegaCategory?: boolean;
  teachers?: RegisterUserProps[];
  roles?: RoleProps[];
  searchTeacher?: string;
  setSearchTeacher?: (newValue: string) => void;
  onApplyFilter: (courseTypes: string[], status?: string[], device?: string[], payment_method?: string[], target_audience?: string[]) => void;

  onResetFilter: () => void;
  open: boolean;
  onClose: () => void;
  courseTypes?: { value: string; label: string }[];
  status?: { label: string; value: Status }[];
  deviceType?: { label: string; value: DeviceType }[];
  paymentMethod?: { label: string; value: string }[];
  targetAudience?: { label: string; value: string }[]
}

export const CourseFilter = ({
  megaCategories = [],
  categories = [],
  subCategories = [],
  positions = [],
  selections,
  onChange,
  loadingMegaCategory,
  teachers = [],
  roles = [],
  searchTeacher = "",
  setSearchTeacher,
  onApplyFilter,
  onResetFilter,
  open,
  onClose,
  courseTypes,
  status,
  deviceType,
  paymentMethod,
  targetAudience
}: Props) => {
  const theme = useTheme();
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedDevice, setSelectedDeviceType] = useState<string[]>([]);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);

  const handleCourseTypeChange = (type: string, checked: boolean) => {
    setSelectedCourseTypes(prev => {
      if (checked) {
        return [...prev, type];
      } else {
        return prev.filter(t => t !== type);
      }
    });
  };
  const handleStatusChange = (type: string, checked: boolean) => {
    setSelectedStatus(prev => {
      if (checked) {
        return [...prev, type];
      } else {
        return prev.filter(t => t !== type);
      }
    });
  };
  const handleDeviceChange = (type: string, checked: boolean) => {
    setSelectedDeviceType(prev => {
      if (checked) {
        return [...prev, type];
      } else {
        return prev.filter(t => t !== type);
      }
    });
  };
  const hanldePaymentMethodChange = (type: string, checked: boolean) => {
    setSelectedPaymentMode(prev => {
      if (checked) {
        return [...prev, type];
      } else {
        return prev.filter(t => t !== type);
      }
    });
  };
  const handleSelectedAudienceChange = (type: string, checked: boolean) => {
    setSelectedAudience(prev => {
      if (checked) {
        return [...prev, type];
      } else {
        return prev.filter(t => t !== type);
      }
    });
  };

  const handleApplyFilter = () => {
    onApplyFilter(selectedCourseTypes, selectedStatus, selectedDevice, selectedPaymentMode, selectedAudience);
    onClose();
  };

  const handleResetFilter = () => {
    setSelectedCourseTypes([]);
    setSelectedStatus([]);
    setSelectedDeviceType([]);
    setSelectedPaymentMode([]);
    setSelectedAudience([]);
    onResetFilter();
    onClose();
  };


  const handleTeacherChange = (teacherId: number, checked: boolean) => {
    const currentTeachers = selections.teacher_ids || [];
    const updatedTeachers = checked
      ? [...currentTeachers, teacherId]
      : currentTeachers.filter(id => id !== teacherId);
    onChange("teacher", updatedTeachers);
  };

  const handleRoleChange = (roleId: number, checked: boolean) => {
    const currentRoles = selections.role_ids || [];
    const updatedRoles = checked
      ? [...currentRoles, roleId]
      : currentRoles.filter(id => id !== roleId);
    onChange("role", updatedRoles);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogContent>
        <div className="filter__wrapper flex flex-col gap-6">
          {/* Category Filter */}
          <div className="category__filter">
            <Typography variant="h5">Filter</Typography>
            <Divider />
            {megaCategories && megaCategories.length ? <div className="mt-6">
              <CategoryFilter
                megaCategories={megaCategories}
                categories={categories}
                subCategories={subCategories}
                positions={positions}
                selections={selections}
                onChange={onChange}
                loadingMegaCategory={loadingMegaCategory}
              />
            </div> : ""}
          </div>

          {/* Teacher Filter */}
          {teachers.length > 0 ? <div className="user__filter">
            <div className="flex items-center justify-between flex-wrap">
              <Typography variant="h5">Assigned Teachers</Typography>
              <OutlinedInput
                value={searchTeacher}
                onChange={(e) => setSearchTeacher?.(e.target.value)}
                placeholder="Search teachers..."
                startAdornment={<SearchIcon />}
                sx={{
                  padding: "6px 8px",
                  gap: "4px"
                }}
              />
            </div>
            <Divider className="mb-3.5! mt-2!" />
            <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <div className="col-span-1" key={teacher.id}>
                    <FormControlLabel
                      label={
                        <div className="flex items-center gap-3">
                          <img
                            src={teacher?.profile_url || "/logo.svg"}
                            alt={teacher.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span>{teacher.name}</span>
                        </div>
                      }
                      control={
                        <Checkbox
                          checked={selections.teacher_ids?.includes(Number(teacher.id)) || false}
                          onChange={(e) => handleTeacherChange(Number(teacher.id), e.target.checked)}
                        />
                      }
                    />
                  </div>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" className="col-span-full">
                  No teachers found
                </Typography>
              )}
            </div>
          </div> : ""}

          {/* Course Type Filter */}
          {courseTypes && courseTypes.length && !roles.length ? <div className="type__filter">
            <div className="flex items-center justify-between">
              <Typography variant="h5">Course Type</Typography>
            </div>
            <Divider className="mb-3.5! mt-2!" />
            <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {courseTypes.map((type) => (
                <div className="col-span-1" key={type.value}>
                  <FormControlLabel
                    label={type.label}
                    control={
                      <Checkbox
                        checked={selectedCourseTypes.includes(type.value)}
                        onChange={(e) => handleCourseTypeChange(type.value, e.target.checked)}
                      />
                    }
                  />
                </div>
              ))}
            </div>
          </div> : ""}

          {/* Role Filter */}
          {roles && roles.length ? <div className="role__filter">
            <div className="flex items-center justify-between">
              <Typography variant="h5">Role</Typography>
            </div>
            <Divider className="mb-3.5! mt-2!" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9">
              {roles.map((role) => (
                <div className="col-span-1" key={role.id}>
                  <FormControlLabel
                    label={role.name.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    control={
                      <Checkbox
                        checked={selections?.role_ids?.includes(Number(role.id)) || false}
                        onChange={(e) => handleRoleChange(Number(role.id), e.target.checked)}
                      />
                    }
                  />
                </div>
              ))}
            </div>
          </div> : ""}
          {/* Status Filter */}
          {status && status.length ? <div className="role__filter">
            <div className="flex items-center justify-between">
              <Typography variant="h5">Status</Typography>
            </div>
            <Divider className="mb-3.5! mt-2!" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9">
              {status.map((item) => (
                <div className="col-span-1" key={item.value}>
                  <FormControlLabel
                    className="items-center!"
                    label={item.label.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    control={
                      <Checkbox
                        checked={selectedStatus.includes(item.value)}
                        onChange={(e) => handleStatusChange(item.value, e.target.checked)}
                      />
                    }
                  />
                </div>
              ))}
            </div>
          </div> : ""}
          {/* Device Filter */}
          {deviceType && deviceType.length ? <div className="role__filter">
            <div className="flex items-center justify-between">
              <Typography variant="h5">Device Type</Typography>
            </div>
            <Divider className="mb-3.5! mt-2!" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9">
              {deviceType.map((device) => (
                <div className="col-span-1" key={device.value}>
                  <FormControlLabel
                    className="items-center!"
                    label={device.label.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    control={
                      <Checkbox
                        checked={selectedDevice.includes(device.value)}
                        onChange={(e) => handleDeviceChange(device.value, e.target.checked)}
                      />
                    }
                  />
                </div>
              ))}
            </div>
          </div> : ""}
          {/* Payment Method Filter */}
          {paymentMethod && paymentMethod.length ? <div className="role__filter">
            <div className="flex items-center justify-between">
              <Typography variant="h5">Method</Typography>
            </div>
            <Divider className="mb-3.5! mt-2!" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9">
              {paymentMethod.map((method) => (
                <div className="col-span-1" key={method.value}>
                  <FormControlLabel
                    className="items-center!"
                    label={method.label.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    control={
                      <Checkbox
                        checked={selectedPaymentMode.includes(method.value)}
                        onChange={(e) => hanldePaymentMethodChange(method.value, e.target.checked)}
                      />
                    }
                  />
                </div>
              ))}
            </div>
          </div> : ""}
          {/* Audience Filter */}
          {targetAudience && targetAudience.length ? <div className="role__filter">
            <div className="flex items-center justify-between">
              <Typography variant="h5">Target Audience</Typography>
            </div>
            <Divider className="mb-3.5! mt-2!" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9">
              {targetAudience.map((method: any) => (
                <div className="col-span-1" key={method.value}>
                  <FormControlLabel
                    className="items-center!"
                    label={method.label}
                    control={
                      <Checkbox
                        checked={selectedAudience.includes(method.value)}
                        onChange={(e) => handleSelectedAudienceChange(method.value, e.target.checked)}
                      />
                    }
                  />
                </div>
              ))}
            </div>
          </div> : ""}

          <Divider />

          {/* Action Footer */}
          <div className="action__footer flex justify-end items-center gap-2">
            <Button onClick={handleResetFilter} className="font-medium!"
              sx={{
                background: theme.palette.separator.dark,
                color: theme.palette.text.middle
              }}>
              {selections ? "Reset & Close Filter" : "Cancel"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilter}
              className="font-medium!"
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};