import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../../../utils/axiosConfig";

const backendUrl = import.meta.env?.VITE_API_URL;

const EditJobModal = ({
  editModal,
  editForm,
  setEditForm,
  closeEdit,
  submitEdit,
}) => {
  const [companies, setCompanies] = useState([]);

  // fetch companies for selection (no create option here)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const resp = await axios.get(`${backendUrl}/api/admin/companies`, {
          withCredentials: true,
        });
        if (resp.data.success) setCompanies(resp.data.companies || []);
      } catch (err) {
        console.error("Failed to load companies for edit modal", err);
      }
    };
    fetchCompanies();
  }, []);

  // when modal opens, ensure editForm has companyId prefilled from job if available
  useEffect(() => {
    if (editModal?.open && editModal.job) {
      const cid = editModal.job.companyId?._id || editModal.job.companyId || "";
      if (cid) {
        setEditForm((f) => ({ ...f, companyId: cid }));
      }
    }
  }, [editModal?.open]);

  if (!editModal?.open) return null;

  const onCompanyChange = (value) => {
    // find company details and set minimal fields on editForm
    const selected = companies.find((c) => c._id === value) || null;
    setEditForm((f) => ({
      ...f,
      companyId: value,
      companyCity: selected?.city || f.companyCity || "",
      companyState: selected?.state || f.companyState || "",
      companyCountry: selected?.country || f.companyCountry || "",
    }));
  };

  return (
    <div className="fixed inset-0 -top-6 h-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 m-4 overflow-auto max-h-[90vh]">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Edit Job Details
        </h3>

        {/* Company Selection - only existing companies allowed */}
        <div className="space-y-4 mb-4">
          <h4 className="text-lg font-semibold">Company Information</h4>
          <div className="space-y-2">
            <Label htmlFor="companyId">Select Existing Company</Label>
            <Select
              value={editForm.companyId || ""}
              onValueChange={onCompanyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose existing company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company._id} value={company._id}>
                    {company.name} ({company.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company location fields (optional but mirror create form) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-gray-50 rounded">
            <div className="space-y-2">
              <Label htmlFor="companyCity">Company City</Label>
              <Input
                id="companyCity"
                name="companyCity"
                value={editForm.companyCity || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, companyCity: e.target.value }))
                }
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyState">Company State</Label>
              <Input
                id="companyState"
                name="companyState"
                value={editForm.companyState || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, companyState: e.target.value }))
                }
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyCountry">Company Country</Label>
              <Input
                id="companyCountry"
                name="companyCountry"
                value={editForm.companyCountry || ""}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, companyCountry: e.target.value }))
                }
                placeholder="Country"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={editForm.title}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <ReactQuill
              theme="snow"
              value={editForm.description}
              onChange={(value) =>
                setEditForm((p) => ({ ...p, description: value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Location</Label>
              <Input
                value={editForm.location}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={editForm.category}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, category: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Level</Label>
              <Select
                value={editForm.level || ""}
                onValueChange={(val) =>
                  setEditForm((f) => ({ ...f, level: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresher">Fresher</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Experience (years)</Label>
              <Input
                type="number"
                value={editForm.experience}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, experience: e.target.value }))
                }
                min={0}
              />
            </div>
          </div>

          <div>
            <Label>Requirements (comma-separated)</Label>
            <Textarea
              value={editForm.requirements}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, requirements: e.target.value }))
              }
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Employment Type</Label>
              <Select
                value={editForm.employmentType || ""}
                onValueChange={(val) =>
                  setEditForm((f) => ({ ...f, employmentType: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Salary (₹/month)</Label>
              <Input
                type="number"
                value={editForm.salary}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, salary: e.target.value }))
                }
                min={0}
              />
            </div>
            <div>
              <Label>Openings</Label>
              <Input
                type="number"
                value={editForm.openings}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, openings: e.target.value }))
                }
                min={1}
              />
            </div>
            <div>
              <Label>Deadline</Label>
              <Input
                type="date"
                value={editForm.deadline}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, deadline: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="visible"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={!!editForm.visible}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, visible: e.target.checked }))
              }
            />
            <label
              htmlFor="visible"
              className="text-sm font-medium text-gray-700"
            >
              Make job listing visible
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={closeEdit}>
            Cancel
          </Button>
          <Button
            onClick={submitEdit}
            className="bg-legpro-primary hover:bg-legpro-primary-hover"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
