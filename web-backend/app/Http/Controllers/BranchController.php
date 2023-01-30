<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class BranchController extends Controller
{
    public function index(Request $request)
    {
        $query = Branch::query();

        if (auth()->user()->hasRole('IA') || auth()->user()->hasRole('STF')) {
            $query->where('institute_id', auth()->user()->institute_id);
        }

        if ($search = $request->input('search')) {
            if (auth()->user()->hasRole('IA') || auth()->user()->hasRole('STF')) {
                $query->where([['institute_id', '=', auth()->user()->institute_id], ['name', 'like', '%' . $search . '%']])
                    ->orWhere([['institute_id', '=', auth()->user()->institute_id], ['address', 'like', '%' . $search . '%']])
                    ->orWhere([['institute_id', '=', auth()->user()->institute_id], ['state', 'like', '%' . $search . '%']])
                    ->orWhere([['institute_id', '=', auth()->user()->institute_id], ['city', 'like', '%' . $search . '%']])
                    ->orWhereHas('institute', function ($q) use ($search) {
                        $q->where([['id', '=', auth()->user()->institute_id], ['name', 'like', '%' . $search . '%']]);
                    });
            } else {
                $query->whereRaw("name LIKE '%" .  $search . "%'")
                    ->orWhereRaw("address LIKE '%" .  $search . "%'")
                    ->orWhereRaw("state LIKE '%" .  $search . "%'")
                    ->orWhereRaw("city LIKE '%" .  $search . "%'")
                    ->orWhereHas('institute', function ($q) use ($search) {
                        $q->where('name', 'like', '%' . $search . '%');
                    });
            }
        }

        if ($status = $request->input('status')) {
            $query->whereRaw("status LIKE '%" .  $status . "%'");
        }

        $limit = $request->input('limit') ?? 5;

        $data = $query->select('id', 'institute_id', 'name', 'address', 'state', 'city', 'status')
                    ->with(['institute:id,name'])
                    ->orderBy('created_at', 'desc')
                    ->paginate($limit);

        return $this->responseSuccess('Data', $data);
    }

    public function all()
    {
        $query = Branch::query();

        if (!auth()->user()->hasRole('SA') && !auth()->user()->hasRole('OT')) {
            $query->where('institute_id', auth()->user()->institute_id);
        }

        $data = $query->select('id', 'institute_id', 'name')
                    ->where('status', 'approve')
                    ->get();

        return $this->responseSuccess('Data', $data);
    }

    public function show($id)
    {
        $data = Branch::select('id', 'name', 'address', 'state', 'city', 'email', 'landline_number', 'phone', 'pin_code')
                            ->where('id', $id)
                            ->first();

        if (!$data) return $this->responseFailed('Branch not found', '', 404);

        return $this->responseSuccess('Detail data', $data, 200);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string',
            'address' => 'required|string',
            'state' => 'required|string',
            'city' => 'required|string',
            'email' => 'required|string|email',
            'landline_number' => 'required|string',
            'phone' => 'required|string',
            'pin_code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $data = Branch::create(array_merge(
            $validator->validated(),
            [
                'institute_id' => auth()->user()->institute_id
            ]
        ));

        return $this->responseSuccess('Branch successfully created', $data, 201);
    }

    public function update(Request $request, $id)
    {
        $branch = Branch::where('id', $id)->first();
        if (!$branch) return $this->responseFailed('Branch not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'name' => 'required|string',
            'address' => 'required|string',
            'state' => 'required|string',
            'city' => 'required|string',
            'email' => 'required|string|email',
            'landline_number' => 'required|string',
            'phone' => 'required|string',
            'pin_code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $branch->update($validator->validated());

        $data = Branch::find($id);

        return $this->responseSuccess('Branch successfully updated', $data, 200);
    }

    public function destroy($id)
    {
        $branch = Branch::where('id', $id)->first();
        if (!$branch) return $this->responseFailed('Branch not found', '', 404);

        $branch->delete();

        return $this->responseSuccess('Branch successfully deleted');
    }

    public function updateStatus(Request $request, $id)
    {
        $branch = Branch::where('id', $id)->first();
        if (!$branch) return $this->responseFailed('Branch not found', '', 404);

        $input = $request->all();
        $validator = Validator::make($input, [
            'status' => Rule::in(['approve', 'reject']),
        ]);

        if ($validator->fails()) {
            return $this->responseFailed('Validation error', $validator->errors(), 400);
        }

        $branch->update($validator->validated());

        $data = Branch::find($id);

        return $this->responseSuccess('Branch status successfully updated', $data, 200);
    }
}
