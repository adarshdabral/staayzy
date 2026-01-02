import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Plus, X, Upload, Image as ImageIcon } from "lucide-react";

interface Room {
  id: string;
  title: string;
  description: string | null;
  location_address: string;
  location_city: string;
  location_state: string | null;
  rent_amount: number;
  security_deposit: number | null;
  availability: "available" | "occupied" | "maintenance";
  facilities: string[] | null;
  house_rules: string[] | null;
  images: string[] | null;
}

interface EditPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  room: Room | null;
}

const facilityOptions = [
  { id: "WiFi", label: "WiFi" },
  { id: "AC", label: "Air Conditioning" },
  { id: "Food", label: "Food Included" },
  { id: "Parking", label: "Parking" },
  { id: "Gym", label: "Gym Access" },
  { id: "TV", label: "TV" },
  { id: "Laundry", label: "Laundry" },
  { id: "Attached Bath", label: "Attached Bathroom" },
  { id: "Furnished", label: "Furnished" },
  { id: "Power Backup", label: "Power Backup" },
];

const EditPropertyDialog = ({ open, onOpenChange, onSuccess, room }: EditPropertyDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location_address: "",
    location_city: "",
    location_state: "",
    rent_amount: "",
    security_deposit: "",
    availability: "available",
    facilities: [] as string[],
    house_rules: [] as string[],
    images: [] as string[],
  });

  const [newRule, setNewRule] = useState("");

  // Populate form when room changes
  useEffect(() => {
    if (room) {
      setFormData({
        title: room.title || "",
        description: room.description || "",
        location_address: room.location_address || "",
        location_city: room.location_city || "",
        location_state: room.location_state || "",
        rent_amount: room.rent_amount?.toString() || "",
        security_deposit: room.security_deposit?.toString() || "",
        availability: room.availability || "available",
        facilities: room.facilities || [],
        house_rules: room.house_rules || [],
        images: room.images || [],
      });
    }
  }, [room]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleFacility = (facilityId: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter((f) => f !== facilityId)
        : [...prev.facilities, facilityId],
    }));
  };

  const addHouseRule = () => {
    if (newRule.trim()) {
      setFormData((prev) => ({
        ...prev,
        house_rules: [...prev.house_rules, newRule.trim()],
      }));
      setNewRule("");
    }
  };

  const removeHouseRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      house_rules: prev.house_rules.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file",
            description: `${file.name} is not an image file`,
            variant: "destructive",
          });
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 5MB limit`,
            variant: "destructive",
          });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
        toast({
          title: "Images uploaded",
          description: `${uploadedUrls.length} image(s) uploaded successfully`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !room) {
      toast({
        title: "Error",
        description: "You must be logged in to edit a property",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.location_address || !formData.location_city || !formData.rent_amount) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("rooms")
      .update({
        title: formData.title,
        description: formData.description || null,
        location_address: formData.location_address,
        location_city: formData.location_city,
        location_state: formData.location_state || null,
        rent_amount: parseFloat(formData.rent_amount),
        security_deposit: formData.security_deposit ? parseFloat(formData.security_deposit) : 0,
        availability: formData.availability as "available" | "occupied" | "maintenance",
        facilities: formData.facilities,
        house_rules: formData.house_rules,
        images: formData.images,
      })
      .eq("id", room.id);

    setLoading(false);

    if (error) {
      console.error("Error updating property:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update property",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Your property has been updated",
      });
      onSuccess();
      onOpenChange(false);
    }
  };

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>
            Update the details of your property listing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Cozy Studio Near University"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property..."
                rows={3}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Location</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location_address">Address *</Label>
                <Input
                  id="location_address"
                  name="location_address"
                  value={formData.location_address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                />
              </div>
              <div>
                <Label htmlFor="location_city">City *</Label>
                <Input
                  id="location_city"
                  name="location_city"
                  value={formData.location_city}
                  onChange={handleInputChange}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="location_state">State</Label>
                <Input
                  id="location_state"
                  name="location_state"
                  value={formData.location_state}
                  onChange={handleInputChange}
                  placeholder="State"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Pricing</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rent_amount">Monthly Rent (₹) *</Label>
                <Input
                  id="rent_amount"
                  name="rent_amount"
                  type="number"
                  value={formData.rent_amount}
                  onChange={handleInputChange}
                  placeholder="8500"
                />
              </div>
              <div>
                <Label htmlFor="security_deposit">Security Deposit (₹)</Label>
                <Input
                  id="security_deposit"
                  name="security_deposit"
                  type="number"
                  value={formData.security_deposit}
                  onChange={handleInputChange}
                  placeholder="17000"
                />
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) => setFormData({ ...formData, availability: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Facilities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {facilityOptions.map((facility) => (
                <div key={facility.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edit-${facility.id}`}
                    checked={formData.facilities.includes(facility.id)}
                    onCheckedChange={() => toggleFacility(facility.id)}
                  />
                  <label
                    htmlFor={`edit-${facility.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {facility.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">House Rules</h4>
            <div className="flex gap-2">
              <Input
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Add a house rule..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHouseRule();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => addHouseRule()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.house_rules.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.house_rules.map((rule, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    {rule}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeHouseRule(index)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Property Images</h4>
            
            <div className="flex flex-col gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="edit-image-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImages}
                className="w-full h-24 border-dashed border-2 hover:border-primary"
              >
                {uploadingImages ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload images (max 5MB each)
                    </span>
                  </div>
                )}
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border group">
                    <img src={url} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-destructive-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.images.length === 0 && (
              <div className="flex items-center justify-center p-4 border border-dashed rounded-lg">
                <div className="flex flex-col items-center text-muted-foreground">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-sm">No images uploaded yet</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyDialog;