import { Button, Checkbox, Dialog, DialogContent, Divider, FormControlLabel, OutlinedInput, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import SearchIcon from "../../../icons/SearchIcon";
import type { CategoryProps } from "../../../types/category";
import type { SelectionType } from "../../../types/course";
import type { positionProps } from "../../../types/position";
import type { RegisterUserProps } from "../../../types/user";
import CategoryFilter from "../CategoryFilter";

interface Props {
  megaCategories: CategoryProps[];
  categories: CategoryProps[];
  subCategories: CategoryProps[];
  positions: positionProps[];
  selections: SelectionType;
  onChange: (
    type: "mega" | "category" | "sub" | "position" | "teacher",
    ids: number[],
    parentId?: number
  ) => void;
  loadingMegaCategory?: boolean;
  teachers?: RegisterUserProps[];
  searchTeacher?: string;
  setSearchTeacher?: (newValue: string) => void;
  onApplyFilter: (courseTypes: string[]) => void;
  onResetFilter: () => void;
  open: boolean;
  onClose: () => void;
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
  searchTeacher = "",
  setSearchTeacher,
  onApplyFilter,
  onResetFilter,
  open,
  onClose
}: Props) => {
  const theme = useTheme();
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);


  const courseTypes = [
    { value: "free", label: "Free" },
    { value: "subscription", label: "Subscription" },
    { value: "expiry", label: "Expiry" }
  ];

  const handleCourseTypeChange = (type: string, checked: boolean) => {
    setSelectedCourseTypes(prev => {
      if (checked) {
        return [...prev, type];
      } else {
        return prev.filter(t => t !== type);
      }
    });
  };

  const handleApplyFilter = () => {
    onApplyFilter(selectedCourseTypes);
    onClose();
  };

  const handleResetFilter = () => {
    setSelectedCourseTypes([]);
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
            <Divider className="mb-6!" />
            <CategoryFilter
              megaCategories={megaCategories}
              categories={categories}
              subCategories={subCategories}
              positions={positions}
              selections={selections}
              onChange={onChange}
              loadingMegaCategory={loadingMegaCategory}
            />
          </div>

          {/* Teacher Filter */}
          <div className="user__filter">
            <div className="flex items-center justify-between">
              <Typography variant="h5">Assigned Teachers</Typography>
              <OutlinedInput
                value={searchTeacher}
                onChange={(e) => setSearchTeacher?.(e.target.value)}
                placeholder="Search teachers..."
                startAdornment={<SearchIcon />}
                sx={{
                  padding: "6px 8px"
                }}
              />
            </div>
            <Divider className="mb-3.5! mt-2!" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
          </div>

          {/* Course Type Filter */}
          <div className="type__filter">
            <div className="flex items-center justify-between">
              <Typography variant="h5">Course Type</Typography>
            </div>
            <Divider className="mb-3.5! mt-2!" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
          </div>

          <Divider />

          {/* Action Footer */}
          <div className="action__footer flex justify-end items-center gap-2">
            <Button onClick={handleResetFilter} className="font-medium!"
              sx={{
                background: theme.palette.seperator.dark,
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