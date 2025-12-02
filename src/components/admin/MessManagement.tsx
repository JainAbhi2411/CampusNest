import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { messApi } from '@/db/api';
import type { MessFacility } from '@/types/types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  IndianRupee,
  MapPin,
  Utensils,
} from 'lucide-react';
import MessForm from './MessForm';

const MessManagement: React.FC = () => {
  const [messFacilities, setMessFacilities] = useState<MessFacility[]>([]);
  const [filteredMess, setFilteredMess] = useState<MessFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [mealTypeFilter, setMealTypeFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingMess, setEditingMess] = useState<MessFacility | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadMessFacilities();
  }, []);

  useEffect(() => {
    filterMess();
  }, [messFacilities, searchQuery, cityFilter, mealTypeFilter]);

  const loadMessFacilities = async () => {
    try {
      setLoading(true);
      const data = await messApi.getAllMess();
      setMessFacilities(data);
    } catch (error) {
      console.error('Error loading mess facilities:', error);
      toast.error('Failed to load mess facilities');
    } finally {
      setLoading(false);
    }
  };

  const filterMess = () => {
    let filtered = [...messFacilities];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (mess) =>
          mess.name.toLowerCase().includes(query) ||
          mess.location.toLowerCase().includes(query) ||
          mess.city.toLowerCase().includes(query)
      );
    }

    if (cityFilter !== 'all') {
      filtered = filtered.filter((mess) => mess.city === cityFilter);
    }

    if (mealTypeFilter !== 'all') {
      filtered = filtered.filter((mess) => {
        const types = mess.meal_types || [];
        return types.includes(mealTypeFilter);
      });
    }

    setFilteredMess(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      await messApi.deleteMess(id);
      toast.success('Mess facility deleted successfully');
      loadMessFacilities();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting mess:', error);
      toast.error('Failed to delete mess facility');
    }
  };

  const handleFormClose = (success?: boolean) => {
    setShowForm(false);
    setEditingMess(null);
    if (success) {
      loadMessFacilities();
    }
  };

  const cities = Array.from(new Set(messFacilities.map((m) => m.city))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Mess Facility Management</h2>
          <p className="text-muted-foreground">
            Manage all mess facilities and meal services
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Mess Facility
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, location, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="xl:w-48">
            <SelectValue placeholder="Filter by city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
          <SelectTrigger className="xl:w-48">
            <SelectValue placeholder="Filter by meal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meal Types</SelectItem>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="tiffin">Tiffin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full bg-muted" />
          ))}
        </div>
      ) : filteredMess.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No mess facilities found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || cityFilter !== 'all' || mealTypeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first mess facility'}
          </p>
          {!searchQuery && cityFilter === 'all' && mealTypeFilter === 'all' && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Mess Facility
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Meal Types</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMess.map((mess) => (
                <TableRow key={mess.id}>
                  <TableCell>
                    <div className="font-medium">{mess.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {mess.location}, {mess.city}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(mess.meal_types || []).map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-semibold">
                      <IndianRupee className="h-3 w-3" />
                      {mess.monthly_price ? mess.monthly_price.toLocaleString() : 'N/A'}
                      <span className="text-xs text-muted-foreground font-normal">/mo</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{mess.average_rating.toFixed(1)}</span>
                      <span className="text-muted-foreground text-sm">
                        ({mess.total_reviews})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingMess(mess);
                          setShowForm(true);
                        }}
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteConfirm(mess.id)}
                        className="gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={(open) => !open && handleFormClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMess ? 'Edit Mess Facility' : 'Add New Mess Facility'}
            </DialogTitle>
            <DialogDescription>
              {editingMess
                ? 'Update the mess facility details below'
                : 'Fill in the details to add a new mess facility'}
            </DialogDescription>
          </DialogHeader>
          <MessForm mess={editingMess} onClose={handleFormClose} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this mess facility? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessManagement;
