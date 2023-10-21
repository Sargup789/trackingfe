import { ZoneData } from "@/pages/zone";
import { HighlightOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { Form, Field } from "react-final-form";

interface ZoneDialogProps {
  open: boolean;
  handleClose: () => void;
  zoneDialogData: ZoneData | {};
  parentZones: ZoneData[];
  onSubmit: (values: ZoneData) => void;
}

const AddZoneDialog: React.FC<ZoneDialogProps> = ({
  open,
  handleClose,
  zoneDialogData,
  parentZones,
  onSubmit,
}) => {
  const isEditMode = Object.keys(zoneDialogData).length > 0;

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {isEditMode ? "Edit" : "Add"} Zone
        </Box>
        <IconButton
          children={<HighlightOff />}
          color="inherit"
          onClick={handleClose}
          sx={{ transform: "translate(8px, -8px)" }}
        />
      </DialogTitle>
      <DialogContent>
        <Form
          initialValues={zoneDialogData}
          onSubmit={onSubmit}
          render={({ handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  my: 3,
                  mx: 1,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <Field name="name">
                  {({ input }) => (
                    <Box>
                      <Typography className="label">Name</Typography>
                      <TextField
                        {...input}
                        fullWidth
                        size="small"
                        placeholder="Enter name"
                      />
                    </Box>
                  )}
                </Field>
                <Field name="description">
                  {({ input }) => (
                    <Box>
                      <Typography className="label">Description</Typography>
                      <TextField
                        {...input}
                        fullWidth
                        size="small"
                        placeholder="Enter description"
                      />
                    </Box>
                  )}
                </Field>
                <Field name="maxCapacity">
                  {({ input }) => (
                    <Box>
                      <Typography className="label">
                        Maximum Capacity
                      </Typography>
                      <TextField
                        {...input}
                        fullWidth
                        size="small"
                        placeholder="Enter maximum capacity"
                        disabled={values['isParentZone'] === true}
                      />
                    </Box>
                  )}
                </Field>
                <Field name="locationPrefix">
                  {({ input }) => (
                    <Box>
                      <Typography className="label">Prefix</Typography>
                      <TextField
                        {...input}
                        fullWidth
                        size="small"
                        placeholder="Enter prefix"
                        disabled={values['isParentZone'] === true}
                      />
                    </Box>
                  )}
                </Field>

                {isEditMode && (
                  <Field name="id">
                    {({ input }) => (
                      <Box>
                        <Typography className="label">ID</Typography>
                        <TextField
                          {...input}
                          fullWidth
                          size="small"
                          placeholder="Enter ID"
                          disabled
                        />
                      </Box>
                    )}
                  </Field>
                )}

                <FormControlLabel
                  control={
                    <Field
                      name="isFinalZone"
                      component="input"
                      type="checkbox"
                    />
                  }
                  label="Mark this zone as final zone"
                />
                <FormControlLabel
                  control={
                    <Field
                      name="isRetailReady"
                      component="input"
                      type="checkbox"
                    />
                  }
                  label="Is Retail Ready?"
                />
                <FormControlLabel
                  control={
                    <Field name="isActive" component="input" type="checkbox" />
                  }
                  label="Is Active"
                />

                <FormControlLabel
                  control={
                    <Field
                      name="isParentZone"
                      component="input"
                      type="checkbox"
                      disabled={values['isSubZone'] === true}
                    />
                  }
                  label="Is Parent Zone"
                />

                <FormControlLabel
                  control={
                    <Field
                      name="isSubZone"
                      component="input"
                      type="checkbox"
                      disabled={values['isParentZone'] === true}
                    />
                  }
                  label="Is Sub Zone"
                />
              </Box>
              {values.isSubZone && (
                <Field name="parentZoneId">
                  {({ input }) => (
                    <Box>
                      <Typography className="label">Parent Zone</Typography>
                      <Select {...input} fullWidth>
                        {parentZones.map((zone: ZoneData) => {
                          return zone.isParentZone ?
                            (<MenuItem key={zone.id} value={zone.id}>
                              {zone.name}
                            </MenuItem>) : null
                        }
                        )}
                      </Select>
                    </Box>
                  )}
                </Field>
              )}

              <DialogActions>
                <Button
                  style={{
                    borderRadius: 15,
                    backgroundColor: "#E96820",
                    fontSize: "13px"
                  }}
                  variant="contained"
                  type="submit"
                >
                  Save
                </Button>
              </DialogActions>
            </form>
          )}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddZoneDialog;
